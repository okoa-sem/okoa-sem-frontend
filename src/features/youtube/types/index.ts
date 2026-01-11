/**
 * YouTube Feature Types
 */

export interface YouTubeVideo {
  id: string;
  videoId: string;
  title: string;
  description: string;
  channel: string;
  thumbnail: string;
  duration: number;
  viewCount: number;
  subject?: string;
  topic?: string;
  addedAt: string;
}

export interface Playlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  videos: YouTubeVideo[];
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistCreateInput {
  name: string;
  description?: string;
}
