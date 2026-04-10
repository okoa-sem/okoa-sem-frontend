import {
	createNewSession,
	updateSessionTitle,
	deleteSession,
	searchSessions,
	getSessionsCount,
	createQuickSession,
	createFullSession,
	getAllSessions,
	getSessionById,
} from '../api/sessions';
import {
	NewSessionResponse,
	ChatSessionResponse,
	UpdateSessionTitleRequest,
	QuickSessionResponse,
	FullSessionCreationResponse,
	SessionsListResponse,
	CreateFullSessionRequest,
	SessionDetailResponse,
} from '../types';

/**
 * Chat Service - High-level service functions for chat operations
 * Provides business logic layer between components and API calls
 */

export const chatService = {
	/**
	 * Create a new chat session with default title
	 * @returns NewSessionResponse with sessionId, title, isContextual
	 */
	createSession: async (): Promise<NewSessionResponse> => {
		return createNewSession();
	},

	/**
	 * Update the title of an existing chat session
	 * @param sessionId - The session ID to update
	 * @param title - The new title for the session
	 * @returns Updated ChatSessionResponse
	 */
	updateTitle: async (
		sessionId: string,
		title: string
	): Promise<ChatSessionResponse> => {
		return updateSessionTitle(sessionId, { title });
	},

	/**
	 * Delete a chat session and all its messages
	 * @param sessionId - The session ID to delete
	 */
	deleteSession: async (sessionId: string): Promise<void> => {
		return deleteSession(sessionId);
	},

	/**
	 * Search chat sessions by keyword
	 * @param keyword - Search term for session titles
	 * @returns Array of matching ChatSessionResponse
	 */
	searchSessions: async (keyword: string): Promise<ChatSessionResponse[]> => {
		return searchSessions(keyword);
	},

	/**
	 * Get count of active chat sessions for the user
	 * @returns Count of active sessions
	 */
	getActiveSessionsCount: async (): Promise<number> => {
		return getSessionsCount();
	},

	/**
	 * Create a new chat session with default title (Quick creation)
	 * Fast operation with no parameters
	 * @returns QuickSessionResponse with sessionId and default title
	 */
	createQuickSession: async (): Promise<QuickSessionResponse> => {
		return createQuickSession();
	},

	/**
	 * Create a new chat session with custom title and optional document context
	 * Allows document-based contextual sessions for better AI responses
	 * @param title - Custom title for the session
	 * @param documentId - Optional document ID for context
	 * @returns FullSessionCreationResponse
	 */
	createSessionWithContext: async (
		title: string,
		documentId?: string
	): Promise<FullSessionCreationResponse> => {
		return createFullSession({ title, documentId });
	},

	/**
	 * Get all chat sessions for the authenticated user
	 * Includes full session details with messages and metadata
	 * @returns Array of SessionsListResponse
	 */
	getAllSessions: async (): Promise<SessionsListResponse[]> => {
		return getAllSessions();
	},

	/**
	 * Get a specific chat session with all its messages
	 * Full session details including message history and metadata
	 * @param sessionId - The session ID to retrieve
	 * @returns SessionDetailResponse with full message history
	 */
	getSessionById: async (sessionId: string): Promise<SessionDetailResponse> => {
		return getSessionById(sessionId);
	},
};

