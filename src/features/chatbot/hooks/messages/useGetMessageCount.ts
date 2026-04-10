import { useQuery } from '@tanstack/react-query';
import { messageService } from '../../services/messageService';
import { messageKeys } from '@/query/keys';

/**
 * Hook to fetch the total count of messages in a session
 * Lightweight operation useful for statistics and pagination
 * Uses short cache since count changes with each new message
 */
export const useGetMessageCount = (
	sessionId: string | null,
	enabled: boolean = true
) => {
	return useQuery<number, Error>({
		queryKey: sessionId ? messageKeys.messageCount(sessionId) : ['messages', 'count', null],
		queryFn: () => {
			if (!sessionId) {
				throw new Error('Session ID is required');
			}
			return messageService.getMessageCount(sessionId);
		},
		enabled: enabled && !!sessionId,
		staleTime: 60 * 1000, // 1 minute - changes with each message
		retry: 1, // Single retry for simpler query
		refetchOnWindowFocus: false,
		refetchOnReconnect: 'always', // Fetch fresh count on reconnect
	});
};
