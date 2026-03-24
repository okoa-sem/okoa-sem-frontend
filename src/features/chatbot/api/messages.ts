import { httpClient } from '@/core/http/client';
import {
	GetSessionMessagesApiResponse,
	GetMessagesByRoleApiResponse,
	GetLatestMessageApiResponse,
	GetMessageCountApiResponse,
	ChatMessageDetail,
	MessageRole,
	GetRecentMessagesApiResponse,
	GetMessageByIdApiResponse,
	DeleteSessionMessagesApiResponse,
} from '../types';

const CHAT_BASE = '/chat';
const MESSAGES_BASE = `${CHAT_BASE}/messages`;

/**
 * Get all messages for a specific chat session
 * GET /api/v1/chat/messages/session/{sessionId}
 */
export const getSessionMessages = async (
	sessionId: string
): Promise<ChatMessageDetail[]> => {
	try {
		const response = await httpClient.get<GetSessionMessagesApiResponse>(
			`${MESSAGES_BASE}/session/${sessionId}`
		);
		return response.data.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || 'Failed to fetch session messages'
		);
	}
};

/**
 * Get messages filtered by role
 * GET /api/v1/chat/messages/session/{sessionId}/role/{role}
 * Valid roles: USER, ASSISTANT, SYSTEM
 */
export const getMessagesByRole = async (
	sessionId: string,
	role: MessageRole
): Promise<ChatMessageDetail[]> => {
	try {
		const response = await httpClient.get<GetMessagesByRoleApiResponse>(
			`${MESSAGES_BASE}/session/${sessionId}/role/${role}`
		);
		return response.data.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || 'Failed to fetch messages by role'
		);
	}
};

/**
 * Get the latest message in a session
 * GET /api/v1/chat/messages/session/{sessionId}/latest
 */
export const getLatestMessage = async (
	sessionId: string
): Promise<ChatMessageDetail> => {
	try {
		const response = await httpClient.get<GetLatestMessageApiResponse>(
			`${MESSAGES_BASE}/session/${sessionId}/latest`
		);
		return response.data.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || 'Failed to fetch latest message'
		);
	}
};

/**
 * Get the total count of messages in a session
 * GET /api/v1/chat/messages/session/{sessionId}/count
 */
export const getMessageCount = async (sessionId: string): Promise<number> => {
	try {
		const response = await httpClient.get<GetMessageCountApiResponse>(
			`${MESSAGES_BASE}/session/${sessionId}/count`
		);
		return response.data.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || 'Failed to fetch message count'
		);
	}
};

/**
 * Get messages created after a specific timestamp
 * GET /api/v1/chat/messages/session/{sessionId}/recent?after={timestamp}
 * Timestamp format: ISO 8601 (e.g., 2025-11-26T10:00:00)
 * Useful for real-time polling and incremental updates
 */
export const getRecentMessages = async (
	sessionId: string,
	after: string
): Promise<ChatMessageDetail[]> => {
	try {
		const response = await httpClient.get<GetRecentMessagesApiResponse>(
			`${MESSAGES_BASE}/session/${sessionId}/recent`,
			{
				params: {
					after,
				},
			}
		);
		return response.data.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || 'Failed to fetch recent messages'
		);
	}
};

/**
 * Get a specific message by its ID
 * GET /api/v1/chat/messages/{messageId}
 * Global message lookup (not scoped to session)
 */
export const getMessageById = async (
	messageId: string
): Promise<ChatMessageDetail> => {
	try {
		const response = await httpClient.get<GetMessageByIdApiResponse>(
			`${MESSAGES_BASE}/${messageId}`
		);
		return response.data.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || 'Failed to fetch message'
		);
	}
};

/**
 * Delete all messages in a chat session
 * DELETE /api/v1/chat/messages/session/{sessionId}
 * WARNING: This action is destructive and cannot be undone
 */
export const deleteSessionMessages = async (sessionId: string): Promise<void> => {
	try {
		await httpClient.delete<DeleteSessionMessagesApiResponse>(
			`${MESSAGES_BASE}/session/${sessionId}`
		);
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || 'Failed to delete session messages'
		);
	}
};
