import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../../services/chatService';
import { chatKeys } from '@/query/keys';

/**
 * Hook to delete a chat session
 * Invalidates sessions list and count after deletion
 */
export const useDeleteSession = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, string>({
		mutationFn: (sessionId) => chatService.deleteSession(sessionId),
		onSuccess: () => {
			// Invalidate sessions list
			queryClient.invalidateQueries({ queryKey: chatKeys.sessionsList() });
			// Invalidate all sessions queries
			queryClient.invalidateQueries({ queryKey: chatKeys.sessions() });
			// Invalidate count
			queryClient.invalidateQueries({ queryKey: chatKeys.count() });
		},
		onError: (error) => {
			console.error('Failed to delete session:', error.message);
		},
	});
};
