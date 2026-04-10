import {
	getSessionMessages,
	getMessagesByRole,
	getLatestMessage,
	getMessageCount,
	getRecentMessages,
	getMessageById,
	deleteSessionMessages,
} from '../api/messages';
import { ChatMessageDetail, MessageRole } from '../types';

/**
 * Message Service - High-level service functions for message operations
 * Provides business logic layer between components and message API calls
 */

export const messageService = {
	/**
	 * Get all messages for a specific chat session
	 * Returns messages in order
	 * @param sessionId - The session ID to fetch messages for
	 * @returns Array of ChatMessageDetail ordered by creation
	 */
	getSessionMessages: async (sessionId: string): Promise<ChatMessageDetail[]> => {
		return getSessionMessages(sessionId);
	},

	/**
	 * Get messages filtered by role
	 * Useful for showing only user questions or AI responses
	 * @param sessionId - The session ID to fetch messages from
	 * @param role - Message role to filter by (USER, ASSISTANT, SYSTEM)
	 * @returns Array of ChatMessageDetail filtered by role
	 */
	getMessagesByRole: async (
		sessionId: string,
		role: MessageRole
	): Promise<ChatMessageDetail[]> => {
		return getMessagesByRole(sessionId, role);
	},

	/**
	 * Get the latest message in a session
	 * Useful for detecting new messages or showing preview
	 * @param sessionId - The session ID
	 * @returns Most recent ChatMessageDetail
	 */
	getLatestMessage: async (sessionId: string): Promise<ChatMessageDetail> => {
		return getLatestMessage(sessionId);
	},

	/**
	 * Get the total count of messages in a session
	 * Lightweight operation for showing message statistics
	 * @param sessionId - The session ID
	 * @returns Total count of messages in the session
	 */
	getMessageCount: async (sessionId: string): Promise<number> => {
		return getMessageCount(sessionId);
	},

	/**
	 * Get messages created after a specific timestamp
	 * Efficient for real-time polling and incremental updates
	 * @param sessionId - The session ID to fetch messages from
	 * @param after - ISO 8601 timestamp (e.g., 2025-11-26T10:00:00)
	 * @returns Array of ChatMessageDetail created after timestamp
	 */
	getRecentMessages: async (
		sessionId: string,
		after: string
	): Promise<ChatMessageDetail[]> => {
		return getRecentMessages(sessionId, after);
	},

	/**
	 * Get a specific message by its ID
	 * Global message lookup (not scoped to session)
	 * @param messageId - The message ID to retrieve
	 * @returns ChatMessageDetail for the specified message
	 */
	getMessageById: async (messageId: string): Promise<ChatMessageDetail> => {
		return getMessageById(messageId);
	},

	/**
	 * Delete all messages in a chat session
	 * WARNING: This is a destructive operation and cannot be undone
	 * @param sessionId - The session ID whose messages to delete
	 */
	deleteSessionMessages: async (sessionId: string): Promise<void> => {
		return deleteSessionMessages(sessionId);
	},
};
