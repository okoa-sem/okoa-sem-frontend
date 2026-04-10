/**
 * WebSocket Types for Real-Time Chat Communication
 * Handles all message types, payloads, and connection lifecycle
 */

import { ChatMessageDetail } from './index';

/**
 * Message Types sent over WebSocket
 * Discriminated union for type-safe message handling
 */
export type WebSocketMessageType =
	| 'message'
	| 'stream'
	| 'stream_end'
	| 'error'
	| 'subscription_error'
	| 'ping'
	| 'pong';

/**
 * Client Message - User sends question
 * Client -> Server
 */
export interface ClientMessagePayload {
	type: 'message';
	content: string;
}

/**
 * Server Message - Complete exchange (user + assistant)
 * Server -> Client
 * Sent after streaming is complete
 */
export interface ServerMessagePayload {
	type: 'message';
	sessionId: string;
	userMessage: ChatMessageDetail;
	aiResponse: ChatMessageDetail;
	processingTime: string; // e.g., "5.2s"
}

/**
 * Stream Chunk - Partial AI response
 * Server -> Client (multiple times during response generation)
 */
export interface StreamPayload {
	type: 'stream';
	chunk: string; // Partial response text
}

/**
 * Stream End - Marks end of streaming
 * Server -> Client
 * Sent after last stream chunk
 */
export interface StreamEndPayload {
	type: 'stream_end';
	messageId: string;
}

/**
 * Error - General error response
 * Server -> Client
 */
export interface ErrorPayload {
	type: 'error';
	message: string;
}

/**
 * Subscription Error - Auth or subscription validation failure
 * Server -> Client
 * Prevents message sending if subscription invalid
 */
export interface SubscriptionErrorPayload {
	type: 'subscription_error';
	message: string;
	code: 'SUBSCRIPTION_REQUIRED' | 'INVALID_TOKEN' | 'UNAUTHORIZED' | 'TOKEN_EXPIRED';
}

/**
 * Ping - Keep-alive probe from client
 * Client -> Server
 */
export interface PingPayload {
	type: 'ping';
}

/**
 * Pong - Keep-alive response from server
 * Server -> Client
 */
export interface PongPayload {
	type: 'pong';
}

/**
 * Union type for all possible server messages
 * Use for type-safe message handling on client
 */
export type ServerMessage =
	| ServerMessagePayload
	| StreamPayload
	| StreamEndPayload
	| ErrorPayload
	| SubscriptionErrorPayload
	| PongPayload;

/**
 * Union type for all possible client messages
 * Use for type-safe message sending from client
 */
export type ClientMessage = ClientMessagePayload | PingPayload;

/**
 * WebSocket Connection State
 * Tracks the lifecycle of a WebSocket connection
 */
export type WebSocketConnectionState =
	| 'DISCONNECTED'
	| 'CONNECTING'
	| 'CONNECTED'
	| 'AUTHENTICATING'
	| 'AUTHENTICATED'
	| 'SUBSCRIPTION_ERROR'
	| 'ERROR'
	| 'RECONNECTING'
	| 'CLOSED';

/**
 * WebSocket Connection Context
 * Contains connection metadata and current state
 */
export interface WebSocketConnectionContext {
	sessionId: string;
	state: WebSocketConnectionState;
	isConnected: boolean;
	hasValidSubscription: boolean;
	lastMessageTime: number; // Timestamp of last message sent/received
	attemptCount: number; // Reconnection attempt count
	errorMessage?: string;
}

/**
 * Streamed Response Buffer
 * Accumulates stream chunks until stream_end
 */
export interface StreamBuffer {
	sessionId: string;
	messageId: string;
	chunks: string[]; // Array of chunk strings
	startTime: number; // When streaming started
	isComplete: boolean;
}

/**
 * Message Queue Item
 * For queuing messages while connection is not ready
 */
export interface MessageQueueItem {
	message: ClientMessage;
	timestamp: number;
	retries: number;
}

/**
 * WebSocket Event Listeners
 * Callbacks for different WebSocket events
 */
export interface WebSocketEventListeners {
	onConnect?: (context: WebSocketConnectionContext) => void;
	onDisconnect?: (reason?: string) => void;
	onMessage?: (message: ServerMessagePayload) => void;
	onStream?: (payload: StreamPayload) => void;
	onStreamEnd?: (payload: StreamEndPayload) => void;
	onError?: (payload: ErrorPayload) => void;
	onSubscriptionError?: (payload: SubscriptionErrorPayload) => void;
	onPong?: () => void;
}

/**
 * WebSocket Configuration Options
 */
export interface WebSocketConfig {
	baseUrl: string; // ws://localhost:8075/api/v1
	reconnectDelay: number; // Initial reconnection delay in ms
	maxReconnectDelay: number; // Max reconnection delay in ms
	reconnectBackoffMultiplier: number; // Exponential backoff multiplier
	maxReconnectAttempts: number; // Max retries before giving up
	pingInterval: number; // Keep-alive ping interval in ms
	messageTimeout: number; // Timeout for message send in ms
	streamChunkTimeout: number; // Timeout waiting for next stream chunk
}

/**
 * WebSocket Error Types
 * For specific error handling
 */
export enum WebSocketErrorType {
	CONNECTION_FAILED = 'CONNECTION_FAILED',
	AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
	SUBSCRIPTION_INVALID = 'SUBSCRIPTION_INVALID',
	MESSAGE_SEND_FAILED = 'MESSAGE_SEND_FAILED',
	STREAM_TIMEOUT = 'STREAM_TIMEOUT',
	CONNECTION_CLOSED = 'CONNECTION_CLOSED',
	NETWORK_ERROR = 'NETWORK_ERROR',
	INVALID_MESSAGE = 'INVALID_MESSAGE',
	TOKEN_EXPIRED = 'TOKEN_EXPIRED',
}

/**
 * WebSocket Error with Type
 */
export class WebSocketError extends Error {
	constructor(
		public type: WebSocketErrorType,
		message: string,
		public code?: string
	) {
		super(message);
		this.name = 'WebSocketError';
	}
}

/**
 * Hook return type for useWebSocket
 */
export interface UseWebSocketReturn {
	// State
	connectionState: WebSocketConnectionState;
	isConnected: boolean;
	hasValidSubscription: boolean;
	error?: string;

	// Actions
	connect: (sessionId: string) => Promise<void>;
	disconnect: () => void;
	sendMessage: (content: string) => Promise<void>;

	// Listeners
	on: (event: keyof WebSocketEventListeners, callback: Function) => () => void;
	off: (event: keyof WebSocketEventListeners) => void;
}

/**
 * Hook return type for useWebSocketMessage
 */
export interface UseWebSocketMessageReturn {
	// State
	isLoading: boolean;
	isConnected: boolean;
	streamedContent: string; // Accumulated streamed text
	fullResponse: ServerMessagePayload | null;
	error?: string;

	// Actions
	sendMessage: (content: string) => Promise<void>;
	resetState: () => void;

	// Callbacks
	onMessageSent: () => void;
	onStreamChunk: (chunk: string) => void;
	onStreamComplete: (response: ServerMessagePayload) => void;
}
