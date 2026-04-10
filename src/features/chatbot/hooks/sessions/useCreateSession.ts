import { useMutation } from '@tanstack/react-query';
import { chatService } from '../../services/chatService';
import { NewSessionResponse } from '../../types';

/**
 * Hook to create a new chat session
 * Uses React Query for state management
 */
export const useCreateSession = () => {
	return useMutation<NewSessionResponse>({
		mutationFn: () => chatService.createSession(),
	});
};
