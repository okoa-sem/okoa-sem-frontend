/**
 * useWebSocket Hook
 * Manages WebSocket connection lifecycle for React components
 * Handles connection, disconnection, messaging, and event subscriptions
 * Integrates with Redux for state management
 */

import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import {
	initializeSession,
	setConnectionState,
	setSubscriptionStatus,
	updateLastMessageTime,
	setError,
	clearError,
	addStreamChunk,
	completeStream,
	resetStreamingContent,
	setLastServerMessage,
	removeSession,
	selectSessionConnectionState,
	selectSessionIsConnected,
	selectSessionHasValidSubscription,
	selectStreamingContent,
	selectIsStreaming,
	selectSessionError,
} from '../../slices/websocket.slice';
import {
	getWebSocketService,
	WebSocketService,
} from '../../services/websocketService';
import {
	UseWebSocketReturn,
	WebSocketConnectionState,
	ServerMessagePayload,
	SubscriptionErrorPayload,
	ErrorPayload,
	StreamPayload,
	StreamEndPayload,
} from '../../types/websocket';

/**
 * Hook to manage WebSocket connection for a chat session
 * @param sessionId - Chat session ID (null to disable connection)
 * @param accessToken - JWT access token for authentication
 * @param onMessageReceived - Callback when complete message received
 * @param onError - Callback when error occurs
 */
export const useWebSocket = (
	sessionId: string | null,
	accessToken: string | null,
	onMessageReceived?: (message: ServerMessagePayload) => void,
	onError?: (error: string) => void
): UseWebSocketReturn => {
	const dispatch = useDispatch();
	const wsServiceRef = useRef<WebSocketService | null>(null);

	// Redux selectors for this session
	const connectionState = useAppSelector((state) =>
		selectSessionConnectionState(state, sessionId || '')
	);
	const isConnected = useAppSelector((state) =>
		selectSessionIsConnected(state, sessionId || '')
	);
	const hasValidSubscription = useAppSelector((state) =>
		selectSessionHasValidSubscription(state, sessionId || '')
	);
	const errorMessage = useAppSelector((state) =>
		selectSessionError(state, sessionId || '')
	);

	// Get WebSocket service singleton
	useEffect(() => {
		wsServiceRef.current = getWebSocketService();
	}, []);

	/**
	 * Connect to WebSocket
	 */
	const connect = useCallback(async () => {
		if (!sessionId || !accessToken) {
			console.warn('[useWebSocket] Missing sessionId or accessToken');
			return;
		}

		if (isConnected) {
			console.warn('[useWebSocket] Already connected');
			return;
		}

		try {
			// Initialize session state in Redux
			dispatch(initializeSession(sessionId));
			dispatch(setConnectionState({ sessionId, state: 'CONNECTING' }));

			// Connect service
			const wsService = wsServiceRef.current;
			if (!wsService) {
				throw new Error('WebSocket service not initialized');
			}

			await wsService.connect(sessionId, accessToken);

			// Setup event listeners
			setupEventListeners(wsService, sessionId);

			dispatch(setConnectionState({ sessionId, state: 'AUTHENTICATED' }));
			dispatch(setSubscriptionStatus({ sessionId, isValid: true }));
		} catch (error) {
			const errorMsg =
				error instanceof Error ? error.message : 'Connection failed';
			dispatch(setConnectionState({ sessionId, state: 'ERROR' }));
			dispatch(setError({ sessionId, message: errorMsg }));
			onError?.(errorMsg);
		}
	}, [sessionId, accessToken, isConnected, dispatch, onError]);

	/**
	 * Setup event listeners on WebSocket service
	 */
	const setupEventListeners = useCallback(
		(wsService: WebSocketService, sid: string) => {
			// Connection established
			wsService.on('onConnect', () => {
				console.log('[useWebSocket] Connected');
				dispatch(setConnectionState({ sessionId: sid, state: 'CONNECTED' }));
				dispatch(clearError(sid));
			});

			// Disconnected
			wsService.on('onDisconnect', (reason?: string) => {
				console.log('[useWebSocket] Disconnected:', reason);
				dispatch(setConnectionState({ sessionId: sid, state: 'DISCONNECTED' }));
				if (reason) {
					dispatch(setError({ sessionId: sid, message: reason }));
				}
			});

			// Complete message received
			wsService.on('onMessage', (message: ServerMessagePayload) => {
				console.log('[useWebSocket] Message received:', message);
				dispatch(setLastServerMessage({ sessionId: sid, message }));
				dispatch(resetStreamingContent(sid));
				dispatch(completeStream(sid));
				onMessageReceived?.(message);
			});

			// Stream chunk
			wsService.on('onStream', (payload: StreamPayload) => {
				console.log('[useWebSocket] Stream chunk:', payload.chunk.length, 'chars');
				dispatch(addStreamChunk({ sessionId: sid, chunk: payload.chunk }));
			});

			// Stream end
			wsService.on('onStreamEnd', (payload: StreamEndPayload) => {
				console.log('[useWebSocket] Stream ended:', payload.messageId);
				dispatch(completeStream(sid));
			});

			// Error
			wsService.on('onError', (payload: ErrorPayload) => {
				console.error('[useWebSocket] Error:', payload.message);
				dispatch(setError({ sessionId: sid, message: payload.message }));
				onError?.(payload.message);
			});

			// Subscription error
			wsService.on(
				'onSubscriptionError',
				(payload: SubscriptionErrorPayload) => {
					console.error(
						'[useWebSocket] Subscription error:',
						payload.message
					);
					dispatch(
						setConnectionState({
							sessionId: sid,
							state: 'SUBSCRIPTION_ERROR',
						})
					);
					dispatch(
						setSubscriptionStatus({ sessionId: sid, isValid: false })
					);
					dispatch(setError({ sessionId: sid, message: payload.message }));
					onError?.(payload.message);
				}
			);

			// Pong (keep-alive response)
			wsService.on('onPong', () => {
				console.log('[useWebSocket] Pong received');
				dispatch(updateLastMessageTime({ sessionId: sid, timestamp: Date.now() }));
			});
		},
		[dispatch, onMessageReceived, onError]
	);

	/**
	 * Disconnect from WebSocket
	 */
	const disconnect = useCallback(() => {
		const wsService = wsServiceRef.current;
		if (wsService && sessionId) {
			wsService.disconnect();
			dispatch(setConnectionState({ sessionId, state: 'DISCONNECTED' }));
			dispatch(resetStreamingContent(sessionId));
		}
	}, [sessionId, dispatch]);

	/**
	 * Send message
	 */
	const sendMessage = useCallback(
		async (content: string) => {
			const wsService = wsServiceRef.current;
			if (!wsService) {
				throw new Error('WebSocket service not initialized');
			}

			if (!isConnected) {
				throw new Error('WebSocket not connected');
			}

			try {
				await wsService.sendMessage(content);
				dispatch(updateLastMessageTime({ sessionId: sessionId!, timestamp: Date.now() }));
			} catch (error) {
				const errorMsg =
					error instanceof Error ? error.message : 'Failed to send message';
				dispatch(setError({ sessionId: sessionId!, message: errorMsg }));
				throw new Error(errorMsg);
			}
		},
		[isConnected, dispatch, sessionId]
	);

	/**
	 * Register event listener
	 * Returns unsubscribe function
	 */
	const on = useCallback(
		(event: any, callback: Function): (() => void) => {
			const wsService = wsServiceRef.current;
			if (!wsService) {
				return () => {};
			}
			return wsService.on(event, callback);
		},
		[]
	);

	/**
	 * Unregister event listener
	 */
	const off = useCallback((event: any) => {
		const wsService = wsServiceRef.current;
		if (wsService) {
			wsService.off(event);
		}
	}, []);

	/**
	 * Auto-connect on mount when sessionId and accessToken available
	 */
	useEffect(() => {
		if (sessionId && accessToken && !isConnected) {
			connect();
		}

		return () => {
			// Note: Don't auto-disconnect on unmount to preserve connection
			// Components can call disconnect explicitly if needed
		};
	}, [sessionId, accessToken, isConnected, connect]);

	return {
		// State
		connectionState,
		isConnected,
		hasValidSubscription,
		error: errorMessage,

		// Actions
		connect,
		disconnect,
		sendMessage,

		// Listeners
		on,
		off,
	};
};
