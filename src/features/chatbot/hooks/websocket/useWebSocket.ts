import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
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
	selectSessionConnectionState,
	selectSessionIsConnected,
	selectSessionHasValidSubscription,
	selectSessionError,
} from '../../slices/websocket.slice';
import { WebSocketService } from '../../services/websocketService';
import {
	UseWebSocketReturn,
	ServerMessagePayload,
	SubscriptionErrorPayload,
	ErrorPayload,
	StreamPayload,
	StreamEndPayload,
} from '../../types/websocket';

export const useWebSocket = (
	sessionId: string | null,
	accessToken: string | null,
	onMessageReceived?: (message: ServerMessagePayload) => void,
	onError?: (error: string) => void
): UseWebSocketReturn => {
	const dispatch = useDispatch();

	// ─── Refs: never cause re-renders ────────────────────────────────────────

	// Track which session we have already set up — prevents duplicate connects
	const connectedSessionRef = useRef<string | null>(null);
	// Track whether listeners have been registered for the current session
	const listenersRegisteredRef = useRef<string | null>(null);

	// Store callbacks in refs so listeners never need to be re-registered
	
	const onMessageReceivedRef = useRef(onMessageReceived);
	const onErrorRef = useRef(onError);
	useEffect(() => { onMessageReceivedRef.current = onMessageReceived; }, [onMessageReceived]);
	useEffect(() => { onErrorRef.current = onError; }, [onError]);

	
	const sessionIdRef = useRef(sessionId);
	useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);

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

	// ─── Register listeners (once per session) ────────────────────────────────

	const registerListeners = useCallback((sid: string) => {
		// GUARD: only register once per session
		if (listenersRegisteredRef.current === sid) return;
		listenersRegisteredRef.current = sid;

		const wsService = WebSocketService.getForSession(sid);

		wsService.on('onConnect', () => {
			console.log('[useWebSocket] ✅ Connected:', sid);
			dispatch(setConnectionState({ sessionId: sid, state: 'AUTHENTICATED' }));
			dispatch(setSubscriptionStatus({ sessionId: sid, isValid: true }));
			dispatch(clearError(sid));
		});

		wsService.on('onDisconnect', (reason?: string) => {
			dispatch(setConnectionState({ sessionId: sid, state: 'DISCONNECTED' }));
			if (reason && reason !== 'User initiated disconnect') {
				dispatch(setError({ sessionId: sid, message: reason }));
			}
		});

		wsService.on('onMessage', (message: ServerMessagePayload) => {
			dispatch(setLastServerMessage({ sessionId: sid, message }));
			dispatch(completeStream(sid));
			onMessageReceivedRef.current?.(message);
		});

		wsService.on('onStream', (payload: StreamPayload) => {
			// Only dispatch non-empty strings — objects slipping through
			
			if (typeof payload.chunk === 'string' && payload.chunk.length > 0) {
				dispatch(addStreamChunk({ sessionId: sid, chunk: payload.chunk }));
			}
		});

		wsService.on('onStreamEnd', (_payload: StreamEndPayload) => {
			dispatch(completeStream(sid));
		});

		wsService.on('onError', (payload: ErrorPayload) => {
			console.error('[useWebSocket] Error:', payload.message);
			dispatch(setError({ sessionId: sid, message: payload.message }));
			onErrorRef.current?.(payload.message);
		});

		wsService.on('onSubscriptionError', (payload: SubscriptionErrorPayload) => {
			dispatch(setConnectionState({ sessionId: sid, state: 'SUBSCRIPTION_ERROR' }));
			dispatch(setSubscriptionStatus({ sessionId: sid, isValid: false }));
			dispatch(setError({ sessionId: sid, message: payload.message }));
			onErrorRef.current?.(payload.message);
		});

		wsService.on('onPong', () => {
			dispatch(updateLastMessageTime({ sessionId: sid, timestamp: Date.now() }));
		});
	}, [dispatch]); // dispatch is stable — this callback is created once

	// ─── Connect ──────────────────────────────────────────────────────────────

	const connect = useCallback(async () => {
		const sid = sessionIdRef.current;
		if (!sid || !accessToken) return;

		
		if (connectedSessionRef.current === sid) return;

		// Clean up previous session if switching
		if (connectedSessionRef.current && connectedSessionRef.current !== sid) {
			WebSocketService.destroySession(connectedSessionRef.current);
			connectedSessionRef.current = null;
			listenersRegisteredRef.current = null;
		}

		try {
			dispatch(initializeSession(sid));
			dispatch(setConnectionState({ sessionId: sid, state: 'CONNECTING' }));

			// Register listeners BEFORE connecting so onConnect is never missed
			registerListeners(sid);

			// Mark as connected before awaiting to block concurrent calls
			connectedSessionRef.current = sid;

			await WebSocketService.getForSession(sid).connect(sid, accessToken);
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : 'Connection failed';
			console.error('[useWebSocket] connect() failed:', errorMsg);
			connectedSessionRef.current = null;
			listenersRegisteredRef.current = null;
			dispatch(setConnectionState({ sessionId: sid, state: 'ERROR' }));
			dispatch(setError({ sessionId: sid, message: errorMsg }));
			onErrorRef.current?.(errorMsg);
		}
	}, [accessToken, dispatch, registerListeners]);
	
	useEffect(() => {
		if (sessionId && accessToken) {
			connect();
		}
	
	}, [sessionId, accessToken]);

	// ─── Disconnect ───────────────────────────────────────────────────────────

	const disconnect = useCallback(() => {
		const sid = sessionIdRef.current;
		if (sid) {
			WebSocketService.destroySession(sid);
			dispatch(setConnectionState({ sessionId: sid, state: 'DISCONNECTED' }));
			dispatch(resetStreamingContent(sid));
			connectedSessionRef.current = null;
			listenersRegisteredRef.current = null;
		}
	}, [dispatch]);

	// ─── Send message ─────────────────────────────────────────────────────────

	const sendMessage = useCallback(
		async (content: string) => {
			const sid = sessionIdRef.current;
			if (!sid) throw new Error('No session ID');
			if (!isConnected) throw new Error('WebSocket not connected');

			const wsService = WebSocketService.getForSession(sid);
			try {
				await wsService.sendMessage(content);
				dispatch(updateLastMessageTime({ sessionId: sid, timestamp: Date.now() }));
			} catch (error) {
				const errorMsg = error instanceof Error ? error.message : 'Failed to send';
				dispatch(setError({ sessionId: sid, message: errorMsg }));
				throw new Error(errorMsg);
			}
		},
		[isConnected, dispatch]
	);

	// ─── Listener helpers ─────────────────────────────────────────────────────

	const on = useCallback((event: any, callback: Function): (() => void) => {
		const sid = sessionIdRef.current;
		if (!sid) return () => {};
		return WebSocketService.getForSession(sid).on(event, callback);
	}, []);

	const off = useCallback((event: any) => {
		const sid = sessionIdRef.current;
		if (sid) WebSocketService.getForSession(sid).off(event);
	}, []);

	return {
		connectionState,
		isConnected,
		hasValidSubscription,
		error: errorMessage,
		connect,
		disconnect,
		sendMessage,
		on,
		off,
	};
};