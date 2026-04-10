import { useQuery } from '@tanstack/react-query';
import { chatService } from '../../services/chatService';
import { SessionsListResponse } from '../../types';
import { chatKeys } from '@/query/keys';

/**
 * Hook to fetch all chat sessions for the authenticated user
 * Returns full session details including messages and metadata
 * Aggressively cached for performance (5 minute staleTime)
 * Refetch on: session creation, deletion, title update
 */
export const useGetAllSessions = (enabled: boolean = true) => {
  return useQuery<SessionsListResponse[], Error>({
    queryKey: chatKeys.allSessions(),
    queryFn: () => chatService.getAllSessions(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes - aggressive caching for performance
    retry: 2, // Retry twice on failure for reliability
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always', // Refetch when reconnecting to ensure fresh data
  });
};
