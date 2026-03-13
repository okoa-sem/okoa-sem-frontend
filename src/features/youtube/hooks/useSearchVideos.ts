import { useMutation } from '@tanstack/react-query';
import { searchVideos } from '../api/search';
import { YouTubeSearchRequest } from '../types';

export const useSearchVideos = () => {
	return useMutation({
		mutationFn: (data: YouTubeSearchRequest) => searchVideos(data),
	});
};
