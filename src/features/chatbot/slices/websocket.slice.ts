/**
 * WebSocket Redux Slice
 * Manages WebSocket connection state, streaming state, and errors
 * Synchronized with WebSocketService events
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	WebSocketConnectionState,
	SubscriptionErrorPayload,
	ServerMessagePayload,
} from '../types/websocket';

/**
 * Per-session WebSocket state
 */
export interface SessionWebSocketState {
	connectionState: WebSocketConnectionState;
	isConnected: boolean;
	hasValidSubscription: boolean;
	lastMessageTime: number;
	errorMessage?: string;
	streamingContent: string; // Accumulated streamed text
	isStreaming: boolean;
	lastServerMessage?: ServerMessagePayload;
}

/**
 * Root WebSocket state
 */
export interface WebSocketState {
	// Per-session states
	sessions: Record<string, SessionWebSocketState>;
	// Global errors
	lastError?: string;
	// Configuration
	isInitialized: boolean;
}

/**
 * Initial per-session state
 */
const initialSessionState: SessionWebSocketState = {
	connectionState: 'DISCONNECTED',
	isConnected: false,
	hasValidSubscription: false,
	lastMessageTime: 0,
	streamingContent: '',
	isStreaming: false,
};

/**
 * Initial root state
 */
const initialState: WebSocketState = {
	sessions: {},
	isInitialized: false,
};

const websocketSlice = createSlice({
	name: 'websocket',
	initialState,
	reducers: {
		/**
		 * Initialize WebSocket for a session
		 */
		initializeSession: (state, action: PayloadAction<string>) => {
			const sessionId = action.payload;
			if (!state.sessions[sessionId]) {
				state.sessions[sessionId] = { ...initialSessionState };
			}
		},

		/**
		 * Set connection state for a session
		 */
		setConnectionState: (
			state,
			action: PayloadAction<{
				sessionId: string;
				state: WebSocketConnectionState;
			}>
		) => {
			const { sessionId, state: connectionState } = action.payload;
			if (state.sessions[sessionId]) {
				state.sessions[sessionId].connectionState = connectionState;
				state.sessions[sessionId].isConnected =
					connectionState === 'CONNECTED' ||
					connectionState === 'AUTHENTICATED';
			}
		},

		/**
		 * Update subscription status
		 */
		setSubscriptionStatus: (
			state,
			action: PayloadAction<{
				sessionId: string;
				isValid: boolean;
			}>
		) => {
			const { sessionId, isValid } = action.payload;
			if (state.sessions[sessionId]) {
				state.sessions[sessionId].hasValidSubscription = isValid;
			}
		},

		/**
		 * Update last message timestamp
		 */
		updateLastMessageTime: (
			state,
			action: PayloadAction<{
				sessionId: string;
				timestamp: number;
			}>
		) => {
			const { sessionId, timestamp } = action.payload;
			if (state.sessions[sessionId]) {
				state.sessions[sessionId].lastMessageTime = timestamp;
			}
		},

		/**
		 * Set error message
		 */
		setError: (
			state,
			action: PayloadAction<{
				sessionId: string;
				message: string;
			}>
		) => {
			const { sessionId, message } = action.payload;
			if (state.sessions[sessionId]) {
				state.sessions[sessionId].errorMessage = message;
			}
			state.lastError = message;
		},

		/**
		 * Clear error message
		 */
		clearError: (state, action: PayloadAction<string>) => {
			const sessionId = action.payload;
			if (state.sessions[sessionId]) {
				state.sessions[sessionId].errorMessage = undefined;
			}
		},

		/**
		 * Add streamed chunk to buffer
		 */
		addStreamChunk: (
			state,
			action: PayloadAction<{
				sessionId: string;
				chunk: string;
			}>
		) => {
			const { sessionId, chunk } = action.payload;
			if (state.sessions[sessionId]) {
				state.sessions[sessionId].streamingContent += chunk;
				state.sessions[sessionId].isStreaming = true;
			}
		},

		/**
		 * Clear streaming buffer and mark as complete
		 */
		completeStream: (state, action: PayloadAction<string>) => {
			const sessionId = action.payload;
			if (state.sessions[sessionId]) {
				state.sessions[sessionId].isStreaming = false;
			}
		},

		/**
		 * Reset streaming content
		 */
		resetStreamingContent: (state, action: PayloadAction<string>) => {
			const sessionId = action.payload;
			if (state.sessions[sessionId]) {
				state.sessions[sessionId].streamingContent = '';
				state.sessions[sessionId].isStreaming = false;
			}
		},

		/**
		 * Set last server message
		 */
		setLastServerMessage: (
			state,
			action: PayloadAction<{
				sessionId: string;
				message: ServerMessagePayload;
			}>
		) => {
			const { sessionId, message } = action.payload;
			if (state.sessions[sessionId]) {
				state.sessions[sessionId].lastServerMessage = message;
			}
		},

		/**
		 * Remove session state when deleted
		 */
		removeSession: (state, action: PayloadAction<string>) => {
			const sessionId = action.payload;
			delete state.sessions[sessionId];
		},

		/**
		 * Mark as initialized
		 */
		setInitialized: (state) => {
			state.isInitialized = true;
		},
	},
});

export const {
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
	setInitialized,
} = websocketSlice.actions;

export default websocketSlice.reducer;

/**
 * Selectors
 */

/**
 * Select WebSocket state for a specific session
 */
export const selectSessionWebSocketState = (state: any, sessionId: string) => {
	return state.websocket?.sessions?.[sessionId] || initialSessionState;
};

/**
 * Select connection state for a session
 */
export const selectSessionConnectionState = (state: any, sessionId: string) => {
	return selectSessionWebSocketState(state, sessionId).connectionState;
};

/**
 * Select if session is connected
 */
export const selectSessionIsConnected = (state: any, sessionId: string) => {
	return selectSessionWebSocketState(state, sessionId).isConnected;
};

/**
 * Select subscription status
 */
export const selectSessionHasValidSubscription = (state: any, sessionId: string) => {
	return selectSessionWebSocketState(state, sessionId).hasValidSubscription;
};

/**
 * Select streaming content
 */
export const selectStreamingContent = (state: any, sessionId: string) => {
	return selectSessionWebSocketState(state, sessionId).streamingContent;
};

/**
 * Select if currently streaming
 */
export const selectIsStreaming = (state: any, sessionId: string) => {
	return selectSessionWebSocketState(state, sessionId).isStreaming;
};

/**
 * Select last server message
 */
export const selectLastServerMessage = (state: any, sessionId: string) => {
	return selectSessionWebSocketState(state, sessionId).lastServerMessage;
};

/**
 * Select error message
 */
export const selectSessionError = (state: any, sessionId: string) => {
	return selectSessionWebSocketState(state, sessionId).errorMessage;
};

/**
 * Select all sessions states
 */
export const selectAllSessionsWebSocketStates = (state: any) => {
	return state.websocket?.sessions || {};
};
