/**
 * useWebSocketMessage Hook
 * Higher-level hook for sending and receiving chat messages
 * Handles message state, loading, streaming, and error management
 * Simplifies component integration for chat UI
 */

import { useState, useCallback, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import {
	selectStreamingContent,
	selectIsStreaming,
	selectLastServerMessage,
	selectSessionError,
} from '../../slices/websocket.slice';
import { useWebSocket } from './useWebSocket';
import {
	UseWebSocketMessageReturn,
	ServerMessagePayload,
} from '../../types/websocket';

/**
 * Hook for chat message operations with WebSocket
 * Provides simplified interface for sending/receiving messages
 *
 * @param sessionId - Chat session ID
 * @param accessToken - JWT access token
 * @param autoConnect - Whether to auto-connect on mount (default: true)
 * @param onMessageReceived - Callback when message fully received
 * @param onError - Callback when error occurs
 */
export const useWebSocketMessage = (
	sessionId: string | null,
	accessToken: string | null,
	autoConnect: boolean = true,
	onMessageReceived?: (message: ServerMessagePayload) => void,
	onError?: (error: string) => void
): UseWebSocketMessageReturn => {
	// Local state
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>();
	const [messagesSent, setMessagesSent] = useState(0);

	// WebSocket connection hook
	const {
		isConnected,
		hasValidSubscription,
		sendMessage: sendViWS,
		connectionState,
	} = useWebSocket(
		autoConnect ? sessionId : null,
		autoConnect ? accessToken : null,
		onMessageReceived,
		(err) => {
			setError(err);
			onError?.(err);
		}
	);

	// Redux selectors for this session
	const streamedContent = useAppSelector((state) =>
		selectStreamingContent(state, sessionId || '')
	);
	const isStreaming = useAppSelector((state) =>
		selectIsStreaming(state, sessionId || '')
	);
	const fullResponse = useAppSelector((state) =>
		selectLastServerMessage(state, sessionId || '')
	);
	const reduxError = useAppSelector((state) =>
		selectSessionError(state, sessionId || '')
	);

	// Track if message is currently being sent
	useEffect(() => {
		if (isStreaming) {
			setIsLoading(true);
		} else if (messagesSent > 0 && !isStreaming) {
			setIsLoading(false);
		}
	}, [isStreaming, messagesSent]);

	/**
	 * Send message with validation and error handling
	 */
	const sendMessage = useCallback(
		async (content: string): Promise<void> => {
			if (!sessionId) {
				throw new Error('No session ID');
			}

			if (!content.trim()) {
				throw new Error('Message cannot be empty');
			}

			if (!isConnected) {
				throw new Error('WebSocket not connected');
			}

			if (!hasValidSubscription) {
				throw new Error('No valid subscription');
			}

			try {
				setIsLoading(true);
				setError(undefined);
				setMessagesSent((prev) => prev + 1);

				await sendViWS(content);
			} catch (err) {
				const errorMsg =
					err instanceof Error ? err.message : 'Failed to send message';
				setError(errorMsg);
				setIsLoading(false);
				throw err;
			}
		},
		[sessionId, isConnected, hasValidSubscription, sendViWS]
	);

	/**
	 * Reset message state for new message
	 */
	const resetState = useCallback((): void => {
		setError(undefined);
		setIsLoading(false);
		// Note: streamedContent is managed by Redux, not cleared here
		// to allow viewing previous messages
	}, []);

	/**
	 * Callbacks for message lifecycle (exported for advanced usage)
	 */
	const onMessageSent = useCallback((): void => {
		console.log('[useWebSocketMessage] Message sent');
	}, []);

	const onStreamChunk = useCallback((chunk: string): void => {
		console.log('[useWebSocketMessage] Stream chunk received:', chunk.length, 'chars');
	}, []);

	const onStreamComplete = useCallback((response: ServerMessagePayload): void => {
		console.log('[useWebSocketMessage] Stream complete');
	}, []);

	// Update error from Redux
	useEffect(() => {
		if (reduxError) {
			setError(reduxError);
		}
	}, [reduxError]);

	return {
		// State
		isLoading,
		streamedContent,
		fullResponse: fullResponse || null,
		error: error || reduxError,

		// Actions
		sendMessage,
		resetState,

		// Callbacks (for advanced usage)
		onMessageSent,
		onStreamChunk,
		onStreamComplete,
	};
};
