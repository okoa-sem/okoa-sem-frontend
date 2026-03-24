/**
 * Session Hooks
 * All hooks for chat session management (CRUD operations)
 * 
 * Import from parent: import { useCreateQuickSession } from '@/features/chatbot/hooks/sessions'
 */

// Re-export from local hooks in this folder
export { useCreateQuickSession } from './useCreateQuickSession';
export { useCreateSession } from './useCreateSession';
export { useCreateSessionWithContext } from './useCreateSessionWithContext';
export { useDeleteSession } from './useDeleteSession';
export { useGetAllSessions } from './useGetAllSessions';
export { useGetSessionById } from './useGetSessionById';
export { useSearchSessions } from './useSearchSessions';
export { useSessionsCount } from './useSessionsCount';
export { useUpdateSessionTitle } from './useUpdateSessionTitle';

/**
 * Session Hooks Summary
 *
 * Create Operations:
 * - useCreateQuickSession() - Create with default title
 * - useCreateSessionWithContext() - Create with custom title & document
 *
 * Read Operations:
 * - useGetAllSessions() - Fetch all user sessions
 * - useGetSessionById() - Fetch single session with messages
 * - useSearchSessions() - Search sessions by keyword
 * - useSessionsCount() - Get total session count
 *
 * Update Operations:
 * - useUpdateSessionTitle() - Change session title
 *
 * Delete Operations:
 * - useDeleteSession() - Delete session (cascade delete messages)
 */
