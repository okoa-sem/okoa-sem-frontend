/**
 * WebSocket Hooks
 * All hooks for real-time bidirectional chat communication via WebSocket
 * 
 * Import from parent: import { useWebSocket } from '@/features/chatbot/hooks/websocket'
 */

// Re-export from local hooks in this folder
export { useWebSocket } from './useWebSocket';
export { useWebSocketMessage } from './useWebSocketMessage';

/**
 * WebSocket Hooks Summary
 *
 * Low-Level Hook:
 * - useWebSocket() - Direct WebSocket connection management
 *   ├─ State: connectionState, isConnected, hasValidSubscription, error
 *   ├─ Actions: connect(), disconnect(), sendMessage()
 *   ├─ Events: on(), off() for event listeners
 *   └─ Use Case: Advanced integration, custom event handling
 *
 * High-Level Hook:
 * - useWebSocketMessage() - Simplified message sending/receiving
 *   ├─ State: isLoading, streamedContent, fullResponse, error
 *   ├─ Actions: sendMessage(), resetState()
 *   ├─ Callbacks: onMessageSent, onStreamChunk, onStreamComplete
 *   └─ Use Case: Simple UI integration for chat components
 *
 * WebSocket Features:
 * ✅ 7 message types (message, stream, stream_end, error, subscription_error, ping, pong)
 * ✅ Persistent bidirectional connection
 * ✅ Auto-reconnection with exponential backoff (1s-30s, max 10 attempts)
 * ✅ Keep-alive pings every 30 seconds
 * ✅ Message queuing for offline reliability
 * ✅ Stream chunk buffering with 60s timeout
 * ✅ Subscription validation with error codes
 * ✅ Full Redux integration for state synchronization
 * ✅ Real-time streaming responses
 * ✅ Token-based authentication
 *
 * Connection Lifecycle:
 * DISCONNECTED → CONNECTING → AUTHENTICATING → AUTHENTICATED
 *                    ↓
 *              SUBSCRIPTION_ERROR | ERROR
 *                    ↓
 *              RECONNECTING (exponential backoff)
 */
