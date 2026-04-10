import { useQuery } from '@tanstack/react-query';
import { messageService } from '../../services/messageService';
import { ChatMessageDetail } from '../../types';
import { messageKeys } from '@/query/keys';

/**
 * Hook to fetch a specific message by its global message ID
 * Supports expanding message details, viewing metadata, accessing full content
 * Long cache duration since messages are immutable after creation
 * @param messageId - Message ID to fetch (globally unique)
 * @param enabled - Whether to enable the query (default: true)
 */
export const useGetMessageById = (
	messageId: string | null,
	enabled: boolean = true
) => {
	return useQuery<ChatMessageDetail, Error>({
		queryKey: messageId ? messageKeys.messageDetails(messageId) : ['messages', 'details', null],
		queryFn: () => {
			if (!messageId) {
				throw new Error('Message ID is required');
			}
			return messageService.getMessageById(messageId);
		},
		enabled: enabled && !!messageId,
		staleTime: 10 * 60 * 1000, // 10 minutes - messages are immutable
		retry: 1, // Single retry - if message doesn't exist, it won't appear
		refetchOnWindowFocus: false,
		refetchOnReconnect: false, // No need to refetch on reconnect - data is immutable
	});
};
