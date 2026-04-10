import { useQuery } from '@tanstack/react-query';
import { chatService } from '../../services/chatService';
import { ChatSessionResponse } from '../../types';
import { chatKeys } from '@/query/keys';

/**
 * Hook to search chat sessions by keyword
 * Can be used as a query or set to manual mode for on-demand searches
 */
export const useSearchSessions = (keyword: string, enabled: boolean = true) => {
	return useQuery<ChatSessionResponse[], Error>({
		queryKey: chatKeys.search(keyword),
		queryFn: () => chatService.searchSessions(keyword),
		enabled: enabled && keyword.length > 0,
		staleTime: 60 * 1000, // 1 minute
		retry: 1,
	});
};
