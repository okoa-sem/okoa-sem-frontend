import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../../services/chatService';
import { FullSessionCreationResponse } from '../../types';
import { chatKeys } from '@/query/keys';

interface CreateSessionWithContextParams {
  title: string;
  documentId?: string;
}

/**
 * Hook to create a new chat session with custom title and optional document context
 * Invalidates the sessions list after successful creation
 * Useful for document-based study sessions with AI context
 */
export const useCreateSessionWithContext = () => {
  const queryClient = useQueryClient();

  return useMutation<
    FullSessionCreationResponse,
    Error,
    CreateSessionWithContextParams
  >({
    mutationFn: ({ title, documentId }) =>
      chatService.createSessionWithContext(title, documentId),
    onSuccess: (data) => {
      // Invalidate sessions list to refetch updated data
      queryClient.invalidateQueries({ queryKey: chatKeys.allSessions() });
      queryClient.invalidateQueries({ queryKey: chatKeys.sessionsList() });
      // Invalidate count since new session was created
      queryClient.invalidateQueries({ queryKey: chatKeys.count() });
    },
    onError: (error) => {
      console.error('Failed to create session with context:', error.message);
    },
  });
};
