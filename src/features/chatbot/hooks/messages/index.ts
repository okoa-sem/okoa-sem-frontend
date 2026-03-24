/**
 * Message Hooks
 * All hooks for chat message management and retrieval
 * 
 * Import from parent: import { useGetSessionMessages } from '@/features/chatbot/hooks/messages'
 */

// Re-export from local hooks in this folder
export { useGetSessionMessages } from './useGetSessionMessages';
export { useGetMessagesByRole } from './useGetMessagesByRole';
export { useGetLatestMessage } from './useGetLatestMessage';
export { useGetMessageCount } from './useGetMessageCount';
export { useGetRecentMessages } from './useGetRecentMessages';
export { useGetMessageById } from './useGetMessageById';
export { useDeleteSessionMessages } from './useDeleteSessionMessages';

/**
 * Message Hooks Summary
 *
 * Retrieval Operations:
 * - useGetSessionMessages() - Fetch all messages in a session
 * - useGetMessagesByRole() - Filter messages by role (USER|ASSISTANT|SYSTEM)
 * - useGetLatestMessage() - Get most recent message (real-time, 30s cache)
 * - useGetMessageCount() - Get total message count
 * - useGetRecentMessages() - Fetch messages after timestamp (polling)
 * - useGetMessageById() - Get specific message by global ID (immutable, 10m cache)
 *
 * Mutation Operations:
 * - useDeleteSessionMessages() - Delete all messages from session (destructive)
 *
 * Use Cases:
 * - useGetSessionMessages: Load entire chat history
 * - useGetMessagesByRole: Filter assistant vs user messages
 * - useGetLatestMessage: Display last message in sidebar
 * - useGetMessageCount: Show message indicators
 * - useGetRecentMessages: Real-time polling for live updates
 * - useGetMessageById: Expand individual message details
 * - useDeleteSessionMessages: Clear chat history
 */
