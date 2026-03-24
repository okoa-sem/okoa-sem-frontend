import { useQuery } from '@tanstack/react-query';
import { chatService } from '../../services/chatService';
import { chatKeys } from '@/query/keys';

/**
 * Hook to get count of active chat sessions
 * Can be used for UI indicators showing session limits or quota
 */
export const useSessionsCount = (enabled: boolean = true) => {
	return useQuery<number, Error>({
		queryKey: chatKeys.count(),
		queryFn: () => chatService.getActiveSessionsCount(),
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 1,
	});
};
