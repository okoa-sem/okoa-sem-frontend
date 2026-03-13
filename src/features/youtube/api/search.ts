import { httpClient } from '@/core/http/client';
import {
	YouTubeSearchRequest,
	YouTubeSearchResponse,
} from '../types';

export const searchVideos = async (
	data: YouTubeSearchRequest
): Promise<YouTubeSearchResponse> => {
	const response = await httpClient.post<YouTubeSearchResponse>(
		'/videos/search',
		data
	);
	return response.data;
};
