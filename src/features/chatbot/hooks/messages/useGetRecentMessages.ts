import { useQuery } from '@tanstack/react-query';
import { messageService } from '../../services/messageService';
import { ChatMessageDetail } from '../../types';
import { messageKeys } from '@/query/keys';

/**
 * Hook to fetch messages created after a specific timestamp
 * Excellent for real-time polling and incremental updates
 * Each timestamp creates separate cache entry
 * @param sessionId - Session ID to fetch messages from
 * @param after - ISO 8601 timestamp string (e.g., 2025-11-26T10:00:00)
 * @param enabled - Whether to enable the query (default: true)
 */
export const useGetRecentMessages = (
	sessionId: string | null,
	after: string,
	enabled: boolean = true
) => {
	return useQuery<ChatMessageDetail[], Error>({
		queryKey: sessionId ? messageKeys.recentMessages(sessionId, after) : ['messages', 'recent', null],
		queryFn: () => {
			if (!sessionId) {
				throw new Error('Session ID is required');
			}
			return messageService.getRecentMessages(sessionId, after);
		},
		enabled: enabled && !!sessionId && !!after,
		staleTime: 30 * 1000, // 30 seconds - frequently polled for new content
		retry: 1, // Single retry for simpler query
		refetchOnWindowFocus: false,
		refetchOnReconnect: 'always', // Always fetch fresh on reconnect
	});
};
