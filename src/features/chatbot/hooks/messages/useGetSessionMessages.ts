import { useQuery } from '@tanstack/react-query';
import { messageService } from '../../services/messageService';
import { ChatMessageDetail } from '../../types';
import { messageKeys } from '@/query/keys';

/**
 * Hook to fetch all messages for a specific chat session
 * Returns messages ordered by creation time
 * Useful for loading the full chat history
 */
export const useGetSessionMessages = (
	sessionId: string | null,
	enabled: boolean = true
) => {
	return useQuery<ChatMessageDetail[], Error>({
		queryKey: sessionId ? messageKeys.sessionMessages(sessionId) : ['messages', 'session', null],
		queryFn: () => {
			if (!sessionId) {
				throw new Error('Session ID is required');
			}
			return messageService.getSessionMessages(sessionId);
		},
		enabled: enabled && !!sessionId,
		staleTime: 2 * 60 * 1000, // 2 minutes - messages added continuously
		retry: 2, // Retry twice for reliability
		refetchOnWindowFocus: false,
		refetchOnReconnect: 'always', // Fetch fresh messages on reconnect
	});
};
