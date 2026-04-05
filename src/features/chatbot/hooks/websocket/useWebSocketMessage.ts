import { useState, useCallback, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
	selectStreamingContent,
	selectIsStreaming,
	selectLastServerMessage,
	selectSessionError,
	initializeSession,
	resetStreamingContent
} from '../../slices/websocket.slice';
import { useWebSocket } from './useWebSocket';
import { UseWebSocketMessageReturn, ServerMessagePayload } from '../../types/websocket';

export const useWebSocketMessage = (
	sessionId: string | null,
	accessToken: string | null,
	autoConnect: boolean = true,
	onMessageReceived?: (message: ServerMessagePayload) => void,
	onError?: (error: string) => void
): UseWebSocketMessageReturn => {
	const dispatch = useAppDispatch();
	
	const [isWaitingForNetwork, setIsWaitingForNetwork] = useState(false);
	const [error, setError] = useState<string>();

	useEffect(() => {
		if (sessionId) {
			dispatch(initializeSession(sessionId));
		}
	}, [sessionId, dispatch]);

	const {
		isConnected,
		hasValidSubscription,
		sendMessage: sendViWS,
	} = useWebSocket(
		autoConnect ? sessionId : null,
		autoConnect ? accessToken : null,
		onMessageReceived,
		(err) => {
			setError(err);
			onError?.(err);
			setIsWaitingForNetwork(false);
		}
	);

	const streamedContent = useAppSelector((state) => selectStreamingContent(state, sessionId || ''));
	const isStreaming = useAppSelector((state) => selectIsStreaming(state, sessionId || ''));
	const fullResponse = useAppSelector((state) => selectLastServerMessage(state, sessionId || ''));
	const reduxError = useAppSelector((state) => selectSessionError(state, sessionId || ''));

	useEffect(() => {
		if (isStreaming) {
			setIsWaitingForNetwork(false);
		}
	}, [isStreaming]);

	const sendMessage = useCallback(
		async (content: string): Promise<void> => {
			if (!sessionId) throw new Error('No session ID');
			if (!content.trim()) throw new Error('Message cannot be empty');
			if (!isConnected) throw new Error('WebSocket not connected');
			if (!hasValidSubscription) throw new Error('No valid subscription');

			try {
				setIsWaitingForNetwork(true);
				setError(undefined);
				dispatch(resetStreamingContent(sessionId));

				await sendViWS(content);
			} catch (err) {
				const errorMsg = err instanceof Error ? err.message : 'Failed to send message';
				setError(errorMsg);
				setIsWaitingForNetwork(false);
				throw err;
			}
		},
		[sessionId, isConnected, hasValidSubscription, sendViWS, dispatch]
	);

	const resetState = useCallback((): void => {
		setError(undefined);
		setIsWaitingForNetwork(false);
	}, []);

	const isLoading = isWaitingForNetwork || isStreaming;

	useEffect(() => {
		if (reduxError) setError(reduxError);
	}, [reduxError]);

	return {
		isLoading,
		isConnected,
		streamedContent,
		fullResponse: fullResponse || null,
		error: error || reduxError,
		sendMessage,
		resetState,
		onMessageSent: () => {},
		onStreamChunk: () => {},
		onStreamComplete: () => {},
	};
};