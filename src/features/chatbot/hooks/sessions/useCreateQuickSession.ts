import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../../services/chatService';
import { QuickSessionResponse } from '../../types';
import { chatKeys } from '@/query/keys';

/**
 * Hook to create a new chat session with default title (Quick creation)
 * Fast operation with no parameters required
 * Ideal for "New Chat" button clicks
 * Invalidates the sessions list after successful creation
 */
export const useCreateQuickSession = () => {
  const queryClient = useQueryClient();

  return useMutation<QuickSessionResponse, Error>({
    mutationFn: () => chatService.createQuickSession(),
    onSuccess: (data) => {
      // Invalidate sessions list to refetch updated data
      queryClient.invalidateQueries({ queryKey: chatKeys.allSessions() });
      queryClient.invalidateQueries({ queryKey: chatKeys.sessionsList() });
      // Invalidate count since new session was created
      queryClient.invalidateQueries({ queryKey: chatKeys.count() });
    },
    onError: (error) => {
      console.error('Failed to create quick session:', error.message);
    },
  });
};
