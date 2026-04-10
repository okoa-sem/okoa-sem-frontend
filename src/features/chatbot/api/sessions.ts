import { httpClient } from '@/core/http/client';
import {
	CreateSessionApiResponse,
	UpdateSessionApiResponse,
	DeleteSessionApiResponse,
	SearchSessionsApiResponse,
	SessionsCountApiResponse,
	NewSessionResponse,
	ChatSessionResponse,
	UpdateSessionTitleRequest,
	QuickCreateSessionApiResponse,
	QuickSessionResponse,
	FullCreateSessionApiResponse,
	FullSessionCreationResponse,
	GetSessionsListApiResponse,
	SessionsListResponse,
	CreateFullSessionRequest,
	GetSessionDetailApiResponse,
	SessionDetailResponse,
} from '../types';

const CHAT_BASE = '/chat';

/**
 * Create a new chat session with default title
 * POST /api/v1/chat/sessions/new
 */
export const createNewSession = async (): Promise<NewSessionResponse> => {
	try {
		const response = await httpClient.post<CreateSessionApiResponse>(
			`${CHAT_BASE}/sessions/new`
		);
		return response.data.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || 'Failed to create chat session'
		);
	}
};

/**
 * Update session title
 * PUT /api/v1/chat/sessions/{sessionId}/title
 */
export const updateSessionTitle = async (
	sessionId: string,
	request: UpdateSessionTitleRequest
): Promise<ChatSessionResponse> => {
	try {
		const response = await httpClient.put<UpdateSessionApiResponse>(
			`${CHAT_BASE}/sessions/${sessionId}/title`,
			request
		);
		return response.data.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || 'Failed to update session title'
		);
	}
};

/**
 * Delete a chat session
 * DELETE /api/v1/chat/sessions/{sessionId}
 */
export const deleteSession = async (sessionId: string): Promise<void> => {
	try {
		await httpClient.delete<DeleteSessionApiResponse>(
			`${CHAT_BASE}/sessions/${sessionId}`
		);
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || 'Failed to delete session'
		);
	}
};

/**
 * Search chat sessions by keyword
 * GET /api/v1/chat/sessions/search?keyword={keyword}
 */
export const searchSessions = async (
	keyword: string
): Promise<ChatSessionResponse[]> => {
	try {
		const response = await httpClient.get<SearchSessionsApiResponse>(
			`${CHAT_BASE}/sessions/search`,
			{
				params: {
					keyword,
				},
			}
		);
		return response.data.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || 'Failed to search sessions'
		);
	}
};

/**
 * Get count of active chat sessions
 * GET /api/v1/chat/sessions/count
 */
export const getSessionsCount = async (): Promise<number> => {
	try {
		const response = await httpClient.get<SessionsCountApiResponse>(
			`${CHAT_BASE}/sessions/count`
		);
		return response.data.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || 'Failed to get sessions count'
		);
	}
};

/**
 * Create a new chat session with default title (Quick creation)
 * POST /api/v1/chat/sessions/new
 * Alternative to createNewSession - returns QuickSessionResponse
 */
export const createQuickSession = async (): Promise<QuickSessionResponse> => {
	try {
		const response = await httpClient.post<QuickCreateSessionApiResponse>(
			`${CHAT_BASE}/sessions/new`
		);
		return response.data.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || 'Failed to create quick session'
		);
	}
};

/**
 * Create a new chat session with custom title and optional document context
 * POST /api/v1/chat/sessions
 */
export const createFullSession = async (
	request: CreateFullSessionRequest
): Promise<FullSessionCreationResponse> => {
	try {
		const response = await httpClient.post<FullCreateSessionApiResponse>(
			`${CHAT_BASE}/sessions`,
			request
		);
		return response.data.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || 'Failed to create session'
		);
	}
};

/**
 * Get all chat sessions for the authenticated user
 * GET /api/v1/chat/sessions
 */
export const getAllSessions = async (): Promise<SessionsListResponse[]> => {
	try {
		const response = await httpClient.get<GetSessionsListApiResponse>(
			`${CHAT_BASE}/sessions`
		);
		return response.data.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || 'Failed to fetch sessions'
		);
	}
};

/**
 * Get a specific chat session with all its messages
 * GET /api/v1/chat/sessions/{sessionId}
 */
export const getSessionById = async (
	sessionId: string
): Promise<SessionDetailResponse> => {
	try {
		const response = await httpClient.get<GetSessionDetailApiResponse>(
			`${CHAT_BASE}/sessions/${sessionId}`
		);
		return response.data.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || 'Failed to fetch session details'
		);
	}
};

