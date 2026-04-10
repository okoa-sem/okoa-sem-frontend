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
	baseUrl: process.env.NEXT_PUBLIC_WEBSOCKET_URL || '',
	reconnectDelay: 1000,
	maxReconnectDelay: 30000,
	reconnectBackoffMultiplier: 1.5,
	maxReconnectAttempts: 5,
	pingInterval: 30000,
	messageTimeout: 15000,
	streamChunkTimeout: 60000,
};

function buildChatWsUrl(baseUrl: string, sessionId: string, token: string): string {
	const cleanBase = baseUrl.replace(/\/$/, '');
	const explicitPath = process.env.NEXT_PUBLIC_CHAT_WS_PATH;
	if (explicitPath) {
		return `${cleanBase}${explicitPath.replace(/\/$/, '')}/${sessionId}?token=${token}`;
	}
	return `${cleanBase}/ws/chat/${sessionId}?token=${token}`;
}

function extractChunkText(message: any): string {
	if (message.data && typeof message.data.content === 'string') {
		return message.data.content;
	}
	if (typeof message.chunk === 'string') return message.chunk;
	if (message.chunk && typeof message.chunk.content === 'string') return message.chunk.content;
	if (typeof message.content === 'string') return message.content;
	if (typeof message.text === 'string') return message.text;
	if (typeof message.message === 'string') return message.message;
	if (message.data && typeof message.data.text === 'string') return message.data.text;
	return '';
}

function extractErrorMessage(message: any): string {
	if (typeof message.message === 'string') {
		return message.message;
	}
	if (message.data && typeof message.data.message === 'string') {
		const dataMsg = message.data.message;
		if (dataMsg.startsWith('{') || dataMsg.startsWith('[')) {
			try {
				const parsed = JSON.parse(dataMsg);
				if (parsed.error?.message) {
					return parsed.error.message;
				}
				if (parsed.message) {
					return parsed.message;
				}
			} catch {
				return dataMsg.substring(0, 200);
			}
		}
		return dataMsg;
	}
	if (typeof message.error === 'string') {
		return message.error;
	}
	return JSON.stringify(message).substring(0, 300);
}

export class WebSocketService {
	private static instances: Map<string, WebSocketService> = new Map();
	private ws: WebSocket | null = null;
	private config: WebSocketConfig;
	private context: WebSocketConnectionContext | null = null;
	private messageQueue: MessageQueueItem[] = [];
	private reconnectAttempts = 0;
	private pingInterval: NodeJS.Timeout | null = null;
	private streamTimeouts: Map<string, NodeJS.Timeout> = new Map();
	private eventListeners: Map<keyof WebSocketEventListeners, Function[]> = new Map();
	private accessToken: string | null = null;
	private currentSessionId: string = '';

	private constructor(config: Partial<WebSocketConfig> = {}) {
		this.config = { ...DEFAULT_CONFIG, ...config };
	}

	public static getForSession(sessionId: string, config?: Partial<WebSocketConfig>): WebSocketService {
		if (!WebSocketService.instances.has(sessionId)) {
			WebSocketService.instances.set(sessionId, new WebSocketService(config));
		}
		return WebSocketService.instances.get(sessionId)!;
	}

	public static destroySession(sessionId: string): void {
		const instance = WebSocketService.instances.get(sessionId);
		if (instance) {
			instance.destroy();
			WebSocketService.instances.delete(sessionId);
		}
	}

	public static getInstance(config?: Partial<WebSocketConfig>): WebSocketService {
		return WebSocketService.getForSession('__default__', config);
	}

	public async connect(sessionId: string, accessToken: string): Promise<void> {
		this.currentSessionId = sessionId;
		this.accessToken = accessToken;
		if (this.ws) {
			const state = this.ws.readyState;
			if (state === WebSocket.OPEN || state === WebSocket.CONNECTING) {
				return;
			}
			if (state === WebSocket.CLOSING) {
				await new Promise<void>((resolve) => {
					const check = setInterval(() => {
						if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
							clearInterval(check);
							resolve();
						}
					}, 100);
					setTimeout(() => { clearInterval(check); resolve(); }, 3000);
				});
			}
		}
		try {
			this.updateContext({
				sessionId,
				state: 'CONNECTING',
				isConnected: false,
				hasValidSubscription: false,
				lastMessageTime: Date.now(),
				attemptCount: this.reconnectAttempts,
			});
			const url = buildChatWsUrl(this.config.baseUrl, sessionId, accessToken);
			return new Promise((resolve, reject) => {
				try {
					this.ws = new WebSocket(url);
					this.ws.onmessage = (event) => this.handleMessage(event);
					this.ws.onerror = () => {
						this.updateContext({ state: 'ERROR', errorMessage: 'Connection error' });
					};
					this.ws.onclose = (event) => this.handleClose(event);
					const connectTimeout = setTimeout(() => {
						if (this.ws) {
							this.ws.onclose = null;
							this.ws.close();
							this.ws = null;
						}
						reject(new WebSocketError(WebSocketErrorType.CONNECTION_FAILED, 'Connection timeout'));
					}, this.config.messageTimeout);
					this.ws.onopen = () => {
						clearTimeout(connectTimeout);
						this.handleOpen();
						resolve();
					};
				} catch (error) {
					reject(new WebSocketError(WebSocketErrorType.CONNECTION_FAILED, `Connection failed: ${error}`));
				}
			});
		} catch (error) {
			this.handleConnectionError(error);
			throw error;
		}
	}

	public disconnect(): void {
		this.reconnectAttempts = this.config.maxReconnectAttempts;
		this.stopKeepAlive();
		this.streamTimeouts.forEach(clearTimeout);
		this.streamTimeouts.clear();
		if (this.ws) {
			this.ws.onclose = null;
			this.ws.onerror = null;
			this.ws.close(1000, 'Client disconnecting');
			this.ws = null;
		}
		this.updateContext({ state: 'DISCONNECTED', isConnected: false });
		this.emit('onDisconnect', 'User initiated disconnect');
	}

	private destroy(): void {
		this.reconnectAttempts = this.config.maxReconnectAttempts;
		this.stopKeepAlive();
		this.eventListeners.clear();
		this.messageQueue = [];
		if (this.ws) {
			this.ws.onopen = null;
			this.ws.onclose = null;
			this.ws.onerror = null;
			this.ws.onmessage = null;
			try { this.ws.close(); } catch {}
			this.ws = null;
		}
	}

	public async sendMessage(content: string): Promise<void> {
		if (!this.isConnected()) {
			throw new WebSocketError(WebSocketErrorType.MESSAGE_SEND_FAILED, 'WebSocket not connected');
		}
		if (!this.context?.hasValidSubscription) {
			throw new WebSocketError(WebSocketErrorType.SUBSCRIPTION_INVALID, 'No valid subscription');
		}
		this.send({ type: 'message', content });
	}

	private sendPing(): void {
		if (this.isConnected()) {
			try { this.send({ type: 'ping' }); } catch {}
		}
	}

	private send(message: ClientMessage): void {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
			throw new WebSocketError(WebSocketErrorType.MESSAGE_SEND_FAILED, 'WebSocket not open');
		}
		this.ws.send(JSON.stringify(message));
		this.updateContext({ lastMessageTime: Date.now() });
	}

	private handleOpen(): void {
		this.reconnectAttempts = 0;
		this.updateContext({
			state: 'AUTHENTICATED',
			isConnected: true,
			hasValidSubscription: true,
		});
		this.startKeepAlive();
		this.processMessageQueue();
		this.emit('onConnect', this.context!);
	}

	private handleMessage(event: MessageEvent): void {
		try {
			const message = JSON.parse(event.data);
			this.updateContext({ lastMessageTime: Date.now() });
			switch (message.type) {
				case 'user_message':
				case 'message': {
					const normalized: ServerMessagePayload = {
						type: 'message',
						sessionId: message.sessionId || this.currentSessionId,
						userMessage: message.userMessage || message.user_message || null,
						aiResponse: message.aiResponse || message.ai_response || message.response || null,
						processingTime: message.processingTime || message.processing_time || '',
					};
					this.emit('onMessage', normalized);
					break;
				}
				case 'chunk':
				case 'stream': {
					const chunkText = extractChunkText(message);
					if (chunkText) {
						const streamPayload: StreamPayload = {
							type: 'stream',
							chunk: chunkText,
						};
						this.emit('onStream', streamPayload);
					}
					break;
				}
				case 'complete':
				case 'stream_end': {
					const messageId = message.messageId || message.message_id
						|| (message.data && message.data.messageId)
						|| '';
					const endPayload: StreamEndPayload = {
						type: 'stream_end',
						messageId,
					};
					this.emit('onStreamEnd', endPayload);
					if (messageId) this.clearStreamTimeout(messageId);
					break;
				}
				case 'error': {
					const errorMessage = extractErrorMessage(message);
					const errorPayload: ErrorPayload = {
						type: 'error',
						message: errorMessage || 'Unknown error from server',
					};
					this.emit('onError', errorPayload);
					break;
				}
				case 'subscription_error': {
					const errorMessage = extractErrorMessage(message);
					this.updateContext({ state: 'SUBSCRIPTION_ERROR', hasValidSubscription: false });
					const subscriptionErrorPayload: SubscriptionErrorPayload = {
						type: 'subscription_error',
						message: errorMessage || 'Subscription error',
						code: message.code || 'UNAUTHORIZED',
					};
					this.emit('onSubscriptionError', subscriptionErrorPayload);
					break;
				}
				case 'pong': {
					this.emit('onPong');
					break;
				}
				default: {
					break;
				}
			}
		} catch (error) {}
	}

	private handleClose(event: CloseEvent): void {
		this.ws = null;
		this.stopKeepAlive();
		this.updateContext({ state: 'DISCONNECTED', isConnected: false });
		this.emit('onDisconnect', `Code ${event.code}`);
		if (event.code !== 1000 && this.reconnectAttempts < this.config.maxReconnectAttempts) {
			this.scheduleReconnect();
		} else if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
			this.emit('onError', { type: 'error', message: 'Failed to connect after multiple attempts' });
		}
	}

	private scheduleReconnect(): void {
		const delay = Math.min(
			this.config.reconnectDelay * Math.pow(this.config.reconnectBackoffMultiplier, this.reconnectAttempts),
			this.config.maxReconnectDelay
		);
		this.reconnectAttempts++;
		this.updateContext({ state: 'RECONNECTING', attemptCount: this.reconnectAttempts });
		setTimeout(() => {
			if (this.currentSessionId && this.accessToken) {
				this.connect(this.currentSessionId, this.accessToken).catch(() => {});
			}
		}, delay);
	}

	private processMessageQueue(): void {
		while (this.messageQueue.length > 0 && this.isConnected()) {
			const item = this.messageQueue.shift();
			if (item) {
				try { this.send(item.message); }
				catch { this.messageQueue.unshift(item); break; }
			}
		}
	}

	private startKeepAlive(): void {
		this.stopKeepAlive();
		this.pingInterval = setInterval(() => this.sendPing(), this.config.pingInterval);
	}

	private stopKeepAlive(): void {
		if (this.pingInterval) {
			clearInterval(this.pingInterval);
			this.pingInterval = null;
		}
	}

	private handleConnectionError(error: any): void {
		const msg = error instanceof Error ? error.message : 'Connection failed';
		this.updateContext({ state: 'ERROR', isConnected: false, errorMessage: msg });
		this.emit('onDisconnect', msg);
	}

	private clearStreamTimeout(messageId: string): void {
		const t = this.streamTimeouts.get(messageId);
		if (t) { clearTimeout(t); this.streamTimeouts.delete(messageId); }
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
		if (!this.eventListeners.has(event)) this.eventListeners.set(event, []);
		this.eventListeners.get(event)!.push(callback);
		return () => this.off(event, callback);
	}

	public off(event: keyof WebSocketEventListeners, callback?: Function): void {
		if (!callback) { this.eventListeners.delete(event); return; }
		const listeners = this.eventListeners.get(event);
		if (listeners) {
			const idx = listeners.indexOf(callback);
			if (idx > -1) listeners.splice(idx, 1);
		}
	}

	private emit(event: keyof WebSocketEventListeners, ...args: any[]): void {
		(this.eventListeners.get(event) || []).forEach((cb) => {
			try { cb(...args); } catch (e) {}
		});
	}

	public isConnected(): boolean {
		return this.ws !== null && this.ws.readyState === WebSocket.OPEN && this.context?.isConnected === true;
	}

	public getContext(): WebSocketConnectionContext | null {
		return this.context ? { ...this.context } : null;
	}

	public getQueueSize(): number { return this.messageQueue.length; }
}

export const getWebSocketService = (config?: Partial<WebSocketConfig>): WebSocketService => {
	return WebSocketService.getInstance(config);
};