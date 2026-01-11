'use client'

import { Bookmark, BookmarkCheck, ListPlus, Play, Eye, Calendar } from 'lucide-react'
import { YouTubeVideo } from '@/types'

interface VideoCardProps {
  video: YouTubeVideo
  onClick: () => void
  isSaved?: boolean
  onSave?: (e: React.MouseEvent) => void
  onAddToPlaylist?: (e: React.MouseEvent) => void
}

export default function VideoCard({ 
  video, 
  onClick, 
  isSaved = false,
  onSave,
  onAddToPlaylist 
}: VideoCardProps) {
  return (
    <div className="group bg-dark-card rounded-2xl overflow-hidden border-2 border-dark-lighter transition-all hover:-translate-y-1 hover:border-primary">
      {/* Thumbnail */}
      <div 
        onClick={onClick}
        className="relative w-full h-[180px] bg-gradient-to-br from-dark-lighter to-dark-card flex items-center justify-center cursor-pointer overflow-hidden"
      >
        {video.thumbnailUrl ? (
          <img 
            src={video.thumbnailUrl} 
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Play className="w-12 h-12 text-text-gray" />
        )}
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-[60px] h-[60px] bg-primary rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-7 h-7 text-dark ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onSave && (
            <button
              onClick={onSave}
              className={`p-2 rounded-lg backdrop-blur-sm transition-all ${
                isSaved 
                  ? 'bg-primary text-dark' 
                  : 'bg-black/60 text-white hover:bg-black/80'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save video'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          )}
          {onAddToPlaylist && (
            <button
              onClick={onAddToPlaylist}
              className="p-2 bg-black/60 text-white rounded-lg backdrop-blur-sm hover:bg-black/80 transition-all"
              title="Add to playlist"
            >
              <ListPlus className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Duration Badge  */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-semibold rounded">
            {video.duration}
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-4" onClick={onClick}>
        <h3 className="text-base font-semibold mb-2 line-clamp-2 leading-snug text-white cursor-pointer hover:text-primary transition-colors">
          {video.title}
        </h3>
        <p className="text-text-gray text-sm mb-2">
          {video.channel}
        </p>
        <div className="flex items-center gap-3 text-text-gray text-xs">
          {video.views && (
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {video.views} views
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {video.publishedAt}
          </span>
        </div>
      </div>
    </div>
  )
}
