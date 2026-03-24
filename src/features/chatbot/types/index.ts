/**
 * Chatbot Feature Types
 */

export interface ChatMessage {
  id: string;
  sessionId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface ChatResponse {
  message: ChatMessage;
  session: ChatSession;
}

/**
 * Chat Session Response from API
 * Used for all session-related endpoints
 */
export interface ChatSessionResponse {
  sessionId: string;
  title: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
  isContextual: boolean;
  documentId?: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

/**
 * New Session Response from API
 */
export interface NewSessionResponse extends Omit<ChatSessionResponse, 'status' | 'documentId' | 'messages'> {
  message: string;
}

/**
 * API Response wrapper
 */
export interface ApiResponseWrapper<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Specific API response types
 */
export type CreateSessionApiResponse = ApiResponseWrapper<NewSessionResponse>;
export type UpdateSessionApiResponse = ApiResponseWrapper<ChatSessionResponse>;
export type DeleteSessionApiResponse = ApiResponseWrapper<null>;
export type SearchSessionsApiResponse = ApiResponseWrapper<ChatSessionResponse[]>;
export type SessionsCountApiResponse = ApiResponseWrapper<number>;

/**
 * Request types
 */
export interface UpdateSessionTitleRequest {
  title: string;
}

/**
 * Create Full Session Request
 * POST /api/v1/chat/sessions
 */
export interface CreateFullSessionRequest {
  title: string;
  documentId?: string;
}

/**
 * Quick Session Response
 * Response from POST /api/v1/chat/sessions/new
 * Lighter response with message field in data
 */
export interface QuickSessionResponse {
  sessionId: string;
  title: string;
  isContextual: boolean;
  message: string;
}

/**
 * Full Session Creation Response
 * Response from POST /api/v1/chat/sessions
 * Includes contextual flag and message in data
 */
export interface FullSessionCreationResponse {
  sessionId: string;
  title: string;
  isContextual: boolean;
  message: string;
}

/**
 * Sessions List Response
 * Response from GET /api/v1/chat/sessions
 * Returns array of full session objects with nullable documentId
 */
export interface SessionsListResponse {
  sessionId: string;
  title: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
  isContextual: boolean;
  documentId: string | null;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Session Message Detail
 * Individual message in a session with full metadata
 */
export interface SessionMessage {
  messageId: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  order: number;
  metadata: Record<string, any> | null;
  createdAt: string;
}

/**
 * Session Detail Response
 * Response from GET /api/v1/chat/sessions/{sessionId}
 * Full session with detailed messages array
 */
export interface SessionDetailResponse {
  sessionId: string;
  title: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
  isContextual: boolean;
  documentId: string | null;
  messages: SessionMessage[];
  createdAt: string;
  updatedAt: string;
}

/**
 * API response types for new endpoints
 */
export type QuickCreateSessionApiResponse = ApiResponseWrapper<QuickSessionResponse>;
export type FullCreateSessionApiResponse = ApiResponseWrapper<FullSessionCreationResponse>;
export type GetSessionsListApiResponse = ApiResponseWrapper<SessionsListResponse[]>;
export type GetSessionDetailApiResponse = ApiResponseWrapper<SessionDetailResponse>;

/**
 * Message Role Type
 * Valid roles for filtering messages
 */
export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM';

/**
 * Chat Message (API Response format)
 * Detailed message object from message endpoints
 */
export interface ChatMessageDetail {
  messageId: string;
  role: MessageRole;
  content: string;
  order: number;
  metadata: Record<string, any> | null;
  createdAt: string;
}

/**
 * API Response Types for Message Endpoints
 */
export type GetSessionMessagesApiResponse = ApiResponseWrapper<ChatMessageDetail[]>;
export type GetMessagesByRoleApiResponse = ApiResponseWrapper<ChatMessageDetail[]>;
export type GetLatestMessageApiResponse = ApiResponseWrapper<ChatMessageDetail>;
export type GetMessageCountApiResponse = ApiResponseWrapper<number>;
export type GetRecentMessagesApiResponse = ApiResponseWrapper<ChatMessageDetail[]>;
export type GetMessageByIdApiResponse = ApiResponseWrapper<ChatMessageDetail>;
export type DeleteSessionMessagesApiResponse = ApiResponseWrapper<null>;
