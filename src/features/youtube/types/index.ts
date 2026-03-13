/**
 * YouTube Feature Types
 */

export interface YouTubeVideoFromAPI {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  channel_title: string;
  published_at: string;
  duration: string;
  view_count: string;
}

export interface YouTubeSearchResponse {
  success: boolean;
  message: string;
  data: {
    videos: YouTubeVideoFromAPI[];
    total_results: number;
    next_page_token: string;
  };
}

export interface YouTubeSearchRequest {
  q: string;
  max_results: number;
  page_token?: string;
  order: 'relevance' | 'date' | 'viewCount' | 'rating' | 'title';
}

export interface PlaylistCreateInput {
  name: string;
  description?: string;
}
