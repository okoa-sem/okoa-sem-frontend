import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../../services/chatService';
import { ChatSessionResponse } from '../../types';
import { chatKeys } from '@/query/keys';

/**
 * Hook to update chat session title
 * Invalidates the session details and search results after update
 */
export const useUpdateSessionTitle = () => {
	const queryClient = useQueryClient();

	return useMutation<ChatSessionResponse, Error, { sessionId: string; title: string }>({
		mutationFn: ({ sessionId, title }) => chatService.updateTitle(sessionId, title),
		onSuccess: (data) => {
			// Invalidate session details
			queryClient.invalidateQueries({ queryKey: chatKeys.sessionDetails(data.sessionId) });
			// Invalidate sessions list
			queryClient.invalidateQueries({ queryKey: chatKeys.sessionsList() });
		},
		onError: (error) => {
			console.error('Failed to update session title:', error.message);
		},
	});
};
