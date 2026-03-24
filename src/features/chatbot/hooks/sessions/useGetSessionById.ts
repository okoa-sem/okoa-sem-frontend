import { useQuery } from '@tanstack/react-query';
import { chatService } from '../../services/chatService';
import { SessionDetailResponse } from '../../types';
import { chatKeys } from '@/query/keys';

/**
 * Hook to fetch a specific chat session with all its messages
 * Returns full session details including message history
 * Caches per sessionId for efficient refetching
 * Useful when user opens a specific chat session
 */
export const useGetSessionById = (
	sessionId: string | null,
	enabled: boolean = true
) => {
	return useQuery<SessionDetailResponse, Error>({
		queryKey: sessionId ? chatKeys.sessionDetails(sessionId) : ['chat', 'session', null],
		queryFn: () => {
			if (!sessionId) {
				throw new Error('Session ID is required');
			}
			return chatService.getSessionById(sessionId);
		},
		enabled: enabled && !!sessionId,
		staleTime: 3 * 60 * 1000, // 3 minutes - messages don't change as frequently
		retry: 2, // Retry twice on failure for reliability
		refetchOnWindowFocus: false,
		refetchOnReconnect: 'always', // Refetch when reconnecting to ensure fresh message history
	});
};
