import { useQuery } from '@tanstack/react-query';
import { messageService } from '../../services/messageService';
import { ChatMessageDetail } from '../../types';
import { messageKeys } from '@/query/keys';

/**
 * Hook to fetch the latest message in a session
 * Uses short cache time since messages are continuously added
 * Useful for detecting new messages and showing preview
 */
export const useGetLatestMessage = (
	sessionId: string | null,
	enabled: boolean = true
) => {
	return useQuery<ChatMessageDetail, Error>({
		queryKey: sessionId ? messageKeys.latestMessage(sessionId) : ['messages', 'latest', null],
		queryFn: () => {
			if (!sessionId) {
				throw new Error('Session ID is required');
			}
			return messageService.getLatestMessage(sessionId);
		},
		enabled: enabled && !!sessionId,
		staleTime: 30 * 1000, // 30 seconds - frequently checked for new content
		retry: 1, // Single retry for simpler query
		refetchOnWindowFocus: false,
		refetchOnReconnect: 'always', // Always fetch on reconnect to ensure latest
	});
};
