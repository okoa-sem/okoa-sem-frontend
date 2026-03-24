import { useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService } from '../../services/messageService';
import { messageKeys } from '@/query/keys';
import { getErrorMessage } from '@/shared/utils/errorHandler';

/**
 * Hook to delete all messages from a session
 * Comprehensive cache invalidation clears all message-related caches for the session
 * Consider adding confirmation dialog in UI since this is destructive
 * @param onSuccess - Optional callback on successful deletion
 * @param onError - Optional callback on error
 */
export const useDeleteSessionMessages = (
	onSuccess?: () => void,
	onError?: (error: Error) => void
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (sessionId: string) => messageService.deleteSessionMessages(sessionId),
		onSuccess: (_, sessionId) => {
			// Invalidate all message-related queries for this session
			// This invalidates: sessionMessages, messagesByRole, latestMessage, messageCount, recentMessages, messageDetails
			queryClient.invalidateQueries({
				queryKey: messageKeys.bySession(sessionId),
			});

			onSuccess?.();
		},
		onError: (error: Error) => {
			const message = getErrorMessage(error);
			console.error('Error deleting session messages:', message);
			onError?.(new Error(message));
		},
	});
};
