import {
	WebSocketConnectionContext,
	WebSocketConnectionState,
	WebSocketConfig,
	ClientMessage,
	ServerMessage,
	WebSocketError,
	WebSocketErrorType,
	MessageQueueItem,
	WebSocketEventListeners,
	StreamBuffer,
	SubscriptionErrorPayload,
	ServerMessagePayload,
	StreamPayload,
	StreamEndPayload,
	ErrorPayload,
	PongPayload,
} from '../types/websocket';

const DEFAULT_CONFIG: WebSocketConfig = {
	baseUrl: process.env.NEXT_PUBLIC_CHATBOT_WEBSOCKET_URL || '',
	reconnectDelay: 1000, 
	maxReconnectDelay: 30000, 
	reconnectBackoffMultiplier: 1.5,
	maxReconnectAttempts: 10,
	pingInterval: 30000, 
	messageTimeout: 30000, 
	streamChunkTimeout: 60000, 
};

export class WebSocketService {
	private static instance: WebSocketService;
	private ws: WebSocket | null = null;
	private config: WebSocketConfig;
	private context: WebSocketConnectionContext | null = null;
	private messageQueue: MessageQueueItem[] = [];
	private reconnectAttempts = 0;
	private pingInterval: NodeJS.Timeout | null = null;
	private streamBuffers: Map<string, StreamBuffer> = new Map(); 
	private streamTimeouts: Map<string, NodeJS.Timeout> = new Map(); 
	private eventListeners: Map<keyof WebSocketEventListeners, Function[]> = new Map();
	private accessToken: string | null = null;

	private constructor(config: Partial<WebSocketConfig> = {}) {
		this.config = { ...DEFAULT_CONFIG, ...config };
	}

	public static getInstance(config?: Partial<WebSocketConfig>): WebSocketService {
		if (!WebSocketService.instance) {
			WebSocketService.instance = new WebSocketService(config);
		}
		return WebSocketService.instance;
	}

	public async connect(sessionId: string, accessToken: string): Promise<void> {
        // FIX: Check if already OPEN *or* CONNECTING to prevent thrashing
		if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
			console.warn('[WebSocket] Already connected or connecting');
			return;
		}

		try {
			this.accessToken = accessToken;
			this.updateContext({
				sessionId,
				state: 'CONNECTING',
				isConnected: false,
				hasValidSubscription: false,
				lastMessageTime: Date.now(),
				attemptCount: this.reconnectAttempts,
			});

			const url = `${this.config.baseUrl}/chat/${sessionId}?token=${accessToken}`;
			console.log('[WebSocket] Connecting to:', url);

			return new Promise((resolve, reject) => {
				try {
					this.ws = new WebSocket(url);

					this.ws.onopen = () => this.handleOpen();
					this.ws.onmessage = (event) => this.handleMessage(event);
					this.ws.onerror = (event) => this.handleError(event);
					this.ws.onclose = () => this.handleClose();

					const connectTimeout = setTimeout(() => {
						reject(
							new WebSocketError(
								WebSocketErrorType.CONNECTION_FAILED,
								'WebSocket connection timeout'
							)
						);
					}, this.config.messageTimeout);

					const originalOnOpen = this.ws.onopen;
					const wsInstance = this.ws;
					this.ws.onopen = (event: Event) => {
						clearTimeout(connectTimeout);
						if (originalOnOpen) {
							originalOnOpen.call(wsInstance, event);
						}
						resolve();
					};
				} catch (error) {
					reject(
						new WebSocketError(
							WebSocketErrorType.CONNECTION_FAILED,
							`Connection failed: ${error}`
						)
					);
				}
			});
		} catch (error) {
			this.handleConnectionError(error);
			throw error;
		}
	}

	public disconnect(): void {
		console.log('[WebSocket] Disconnecting...');
		if (this.pingInterval) {
			clearInterval(this.pingInterval);
			this.pingInterval = null;
		}
		this.streamTimeouts.forEach((timeout) => clearTimeout(timeout));
		this.streamTimeouts.clear();

		if (this.ws) {
			this.ws.close(1000, 'Client disconnecting');
			this.ws = null;
		}

		this.updateContext({ state: 'DISCONNECTED', isConnected: false });
		this.emit('onDisconnect', 'User initiated disconnect');
	}

	public async sendMessage(content: string): Promise<void> {
		const message = { type: 'message' as const, content };

		if (!this.isConnected()) {
			console.warn('[WebSocket] Not connected, queueing message');
			this.messageQueue.push({
				message,
				timestamp: Date.now(),
				retries: 0,
			});
			return;
		}

		if (!this.context?.hasValidSubscription) {
			throw new WebSocketError(
				WebSocketErrorType.SUBSCRIPTION_INVALID,
				'No valid subscription'
			);
		}

		this.send(message);
	}

	private sendPing(): void {
		if (this.isConnected()) {
			this.send({ type: 'ping' });
		}
	}

	private send(message: ClientMessage): void {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
			throw new WebSocketError(
				WebSocketErrorType.MESSAGE_SEND_FAILED,
				'WebSocket is not open'
			);
		}

		try {
			this.ws.send(JSON.stringify(message));
			this.updateContext({
				lastMessageTime: Date.now(),
			});
			console.log('[WebSocket] Message sent:', message);
		} catch (error) {
			throw new WebSocketError(
				WebSocketErrorType.MESSAGE_SEND_FAILED,
				`Failed to send message: ${error}`
			);
		}
	}

	private handleOpen(): void {
		console.log('[WebSocket] Connected');
		this.reconnectAttempts = 0;
		this.updateContext({
			state: 'AUTHENTICATING',
			isConnected: true,
		});

		this.startKeepAlive();
		this.processMessageQueue();
		this.emit('onConnect', this.context!);
	}

	private handleMessage(event: MessageEvent): void {
		try {
			const message: ServerMessage = JSON.parse(event.data);
			
			this.updateContext({
				lastMessageTime: Date.now(),
			});

			switch (message.type) {
				case 'message':
					this.handleServerMessage(message as ServerMessagePayload);
					break;
				case 'stream':
					this.handleStreamChunk(message as StreamPayload);
					break;
				case 'stream_end':
					this.handleStreamEnd(message as StreamEndPayload);
					break;
				case 'error':
					this.handleErrorMessage(message as ErrorPayload);
					break;
				case 'subscription_error':
					this.handleSubscriptionError(message as SubscriptionErrorPayload);
					break;
				case 'pong':
					this.handlePong(message as PongPayload);
					break;
			}
		} catch (error) {
			console.error('[WebSocket] Failed to parse message:', error);
		}
	}

	private handleServerMessage(message: ServerMessagePayload): void {
		this.emit('onMessage', message);
		this.clearStreamBuffer(message.aiResponse.messageId);
	}

	private handleStreamChunk(payload: StreamPayload): void {
		this.emit('onStream', payload);
	}

	private handleStreamEnd(payload: StreamEndPayload): void {
		this.emit('onStreamEnd', payload);
		this.clearStreamTimeout(payload.messageId);
	}

	private handleErrorMessage(payload: ErrorPayload): void {
		console.error('[WebSocket] Error from server:', payload.message);
		this.emit('onError', payload);
	}

	private handleSubscriptionError(payload: SubscriptionErrorPayload): void {
		console.error('[WebSocket] Subscription error:', payload);
		this.updateContext({
			state: 'SUBSCRIPTION_ERROR',
			hasValidSubscription: false,
		});
		this.emit('onSubscriptionError', payload);
	}

	private handlePong(payload: PongPayload): void {
		this.emit('onPong');
	}

	private handleError(event: Event): void {
		console.error('[WebSocket] Error:', event);
		const error = new WebSocketError(
			WebSocketErrorType.NETWORK_ERROR,
			'WebSocket error occurred'
		);
		this.updateContext({ state: 'ERROR', errorMessage: error.message });
	}

	private handleClose(): void {
		console.log('[WebSocket] Connection closed');
		this.ws = null;
		this.updateContext({ state: 'DISCONNECTED', isConnected: false });

		if (this.reconnectAttempts < this.config.maxReconnectAttempts) {
			this.scheduleReconnect();
		} else {
			console.error('[WebSocket] Max reconnection attempts reached');
		}
	}

	private scheduleReconnect(): void {
		const delay = Math.min(
			this.config.reconnectDelay *
				Math.pow(this.config.reconnectBackoffMultiplier, this.reconnectAttempts),
			this.config.maxReconnectDelay
		);

		this.reconnectAttempts++;
		console.log(
			`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`
		);

		this.updateContext({
			state: 'RECONNECTING',
			attemptCount: this.reconnectAttempts,
		});

		setTimeout(() => {
			if (this.context && this.accessToken) {
				this.connect(this.context.sessionId, this.accessToken).catch((error) => {
					console.error('[WebSocket] Reconnection failed:', error);
				});
			}
		}, delay);
	}

	private processMessageQueue(): void {
		while (this.messageQueue.length > 0 && this.isConnected()) {
			const item = this.messageQueue.shift();
			if (item) {
				try {
					this.send(item.message);
				} catch (error) {
					this.messageQueue.unshift(item);
					console.error('[WebSocket] Failed to process queued message:', error);
					break;
				}
			}
		}
	}

	private startKeepAlive(): void {
		if (this.pingInterval) {
			clearInterval(this.pingInterval);
		}
		this.pingInterval = setInterval(() => {
			try {
				this.sendPing();
			} catch (error) {
				console.warn('[WebSocket] Failed to send ping:', error);
			}
		}, this.config.pingInterval);
	}

	private handleConnectionError(error: any): void {
		const wsError = error instanceof WebSocketError
			? error
			: new WebSocketError(
					WebSocketErrorType.CONNECTION_FAILED,
					error?.message || 'Connection failed'
			  );

		this.updateContext({
			state: 'ERROR',
			isConnected: false,
			errorMessage: wsError.message,
		});

		this.emit('onDisconnect', wsError.message);
	}

	private createStreamBuffer(sessionId: string, messageId: string): void {
		this.streamBuffers.set(messageId, {
			sessionId,
			messageId,
			chunks: [],
			startTime: Date.now(),
			isComplete: false,
		});

		const timeout = setTimeout(() => {
			console.error(`[WebSocket] Stream timeout for message ${messageId}`);
			this.clearStreamBuffer(messageId);
		}, this.config.streamChunkTimeout);

		this.streamTimeouts.set(messageId, timeout);
	}

	private clearStreamBuffer(messageId: string): void {
		this.streamBuffers.delete(messageId);
		this.clearStreamTimeout(messageId);
	}

	private clearStreamTimeout(messageId: string): void {
		const timeout = this.streamTimeouts.get(messageId);
		if (timeout) {
			clearTimeout(timeout);
			this.streamTimeouts.delete(messageId);
		}
	}

	private updateContext(updates: Partial<WebSocketConnectionContext>): void {
		if (this.context) {
			this.context = { ...this.context, ...updates };
		} else {
			this.context = {
				sessionId: updates.sessionId || '',
				state: updates.state || 'DISCONNECTED',
				isConnected: updates.isConnected || false,
				hasValidSubscription: updates.hasValidSubscription || false,
				lastMessageTime: updates.lastMessageTime || Date.now(),
				attemptCount: updates.attemptCount || 0,
				...updates,
			};
		}
	}

	public on(event: keyof WebSocketEventListeners, callback: Function): () => void {
		if (!this.eventListeners.has(event)) {
			this.eventListeners.set(event, []);
		}
		this.eventListeners.get(event)!.push(callback);
		return () => this.off(event, callback);
	}

	public off(event: keyof WebSocketEventListeners, callback?: Function): void {
		if (!callback) {
			this.eventListeners.delete(event);
		} else {
			const listeners = this.eventListeners.get(event);
			if (listeners) {
				const index = listeners.indexOf(callback);
				if (index > -1) {
					listeners.splice(index, 1);
				}
			}
		}
	}

	private emit(event: keyof WebSocketEventListeners, ...args: any[]): void {
		const listeners = this.eventListeners.get(event) || [];
		listeners.forEach((callback) => {
			try {
				callback(...args);
			} catch (error) {
				console.error(`[WebSocket] Error in ${event} listener:`, error);
			}
		});
	}

	public isConnected(): boolean {
		return (
			this.ws !== null &&
			this.ws.readyState === WebSocket.OPEN &&
			this.context?.isConnected === true
		);
	}

	public getContext(): WebSocketConnectionContext | null {
		return this.context ? { ...this.context } : null;
	}

	public getQueueSize(): number {
		return this.messageQueue.length;
	}
}

export const getWebSocketService = (config?: Partial<WebSocketConfig>): WebSocketService => {
	return WebSocketService.getInstance(config);
};