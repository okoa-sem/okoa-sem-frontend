/**
 * Chatbot Hooks - Central Export Point
 * 
 * Organized into three categories:
 * 1. Session Hooks - CRUD operations on chat sessions
 * 2. Message Hooks - Message retrieval and management
 * 3. WebSocket Hooks - Real-time bidirectional communication
 * 
 * Usage:
 * - import { useCreateQuickSession } from '@/features/chatbot/hooks/sessions'
 * - import { useGetSessionMessages } from '@/features/chatbot/hooks/messages'
 * - import { useWebSocket } from '@/features/chatbot/hooks/websocket'
 * 
 * Or use this main entry point:
 * - import { useCreateQuickSession, useGetSessionMessages, useWebSocket } from '@/features/chatbot/hooks'
 */

// Session Hooks
export {
	useCreateQuickSession,
	useCreateSessionWithContext,
	useUpdateSessionTitle,
	useDeleteSession,
	useGetAllSessions,
	useGetSessionById,
	useSearchSessions,
	useSessionsCount,
} from './sessions';

// Message Hooks
export {
	useGetSessionMessages,
	useGetMessagesByRole,
	useGetLatestMessage,
	useGetMessageCount,
	useGetRecentMessages,
	useGetMessageById,
	useDeleteSessionMessages,
} from './messages';

// WebSocket Hooks
export { useWebSocket, useWebSocketMessage } from './websocket';

/**
 * Re-export types for convenience
 */
export type { UseWebSocketReturn, UseWebSocketMessageReturn } from '../types/websocket';

/**
 * Hook Categories Summary
 * 
 * 📊 TOTAL: 17 Hooks
 * 
 * 🟢 SESSION HOOKS (8)
 *    Create: useCreateQuickSession, useCreateSessionWithContext
 *    Read: useGetAllSessions, useGetSessionById, useSearchSessions, useSessionsCount
 *    Update: useUpdateSessionTitle
 *    Delete: useDeleteSession
 * 
 * 🟦 MESSAGE HOOKS (7)
 *    Retrieval: useGetSessionMessages, useGetMessagesByRole, useGetLatestMessage,
 *               useGetMessageCount, useGetRecentMessages, useGetMessageById
 *    Mutation: useDeleteSessionMessages
 * 
 * 🟪 WEBSOCKET HOOKS (2)
 *    Low-level: useWebSocket
 *    High-level: useWebSocketMessage
 * 
 * 📁 FOLDER STRUCTURE
 * 
 * hooks/
 * ├── index.ts (this file - main export point)
 * ├── sessions/
 * │   ├── index.ts (session hooks exports)
 * │   └── [individual session hook files in parent]
 * ├── messages/
 * │   ├── index.ts (message hooks exports)
 * │   └── [individual message hook files in parent]
 * ├── websocket/
 * │   ├── index.ts (websocket hooks exports)
 * │   └── [individual websocket hook files in parent]
 * ├── useCreateQuickSession.ts
 * ├── useCreateSessionWithContext.ts
 * ├── useUpdateSessionTitle.ts
 * ├── useDeleteSession.ts
 * ├── useGetAllSessions.ts
 * ├── useGetSessionById.ts
 * ├── useSearchSessions.ts
 * ├── useSessionsCount.ts
 * ├── useGetSessionMessages.ts
 * ├── useGetMessagesByRole.ts
 * ├── useGetLatestMessage.ts
 * ├── useGetMessageCount.ts
 * ├── useGetRecentMessages.ts
 * ├── useGetMessageById.ts
 * ├── useDeleteSessionMessages.ts
 * ├── useWebSocket.ts
 * └── useWebSocketMessage.ts
 */
