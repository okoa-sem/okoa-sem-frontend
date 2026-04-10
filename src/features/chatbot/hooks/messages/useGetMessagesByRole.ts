import { useQuery } from '@tanstack/react-query';
import { messageService } from '../../services/messageService';
import { ChatMessageDetail, MessageRole } from '../../types';
import { messageKeys } from '@/query/keys';

/**
 * Hook to fetch messages filtered by role
 * Useful for showing only user questions or AI responses separately
 * Supports: USER, ASSISTANT, SYSTEM
 */
export const useGetMessagesByRole = (
	sessionId: string | null,
	role: MessageRole,
	enabled: boolean = true
) => {
	return useQuery<ChatMessageDetail[], Error>({
		queryKey: sessionId ? messageKeys.messagesByRole(sessionId, role) : ['messages', 'role', null],
		queryFn: () => {
			if (!sessionId) {
				throw new Error('Session ID is required');
			}
			return messageService.getMessagesByRole(sessionId, role);
		},
		enabled: enabled && !!sessionId,
		staleTime: 2 * 60 * 1000, // 2 minutes - same as all messages
		retry: 2,
		refetchOnWindowFocus: false,
		refetchOnReconnect: 'always',
	});
};
