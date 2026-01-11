'use client'

import { YouTubeVideo } from '@/types'
import VideoCard from './VideoCard'

interface VideoResultsProps {
  videos: YouTubeVideo[]
  query: string
  onVideoClick: (video: YouTubeVideo) => void
  savedVideoIds: string[]
  onSaveVideo: (video: YouTubeVideo) => void
  onUnsaveVideo: (videoId: string) => void
  onAddToPlaylist: (video: YouTubeVideo) => void
}

export default function VideoResults({ 
  videos, 
  query, 
  onVideoClick,
  savedVideoIds,
  onSaveVideo,
  onUnsaveVideo,
  onAddToPlaylist,
}: VideoResultsProps) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-white">Results for "{query}"</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => {
          const isSaved = savedVideoIds.includes(video.id)
          return (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => onVideoClick(video)}
              isSaved={isSaved}
              onSave={(e) => {
                e.stopPropagation()
                if (isSaved) {
                  onUnsaveVideo(video.id)
                } else {
                  onSaveVideo(video)
                }
              }}
              onAddToPlaylist={(e) => {
                e.stopPropagation()
                onAddToPlaylist(video)
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
