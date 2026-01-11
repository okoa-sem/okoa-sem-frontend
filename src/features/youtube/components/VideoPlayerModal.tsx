'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Bookmark, BookmarkCheck, ListPlus, Share2, ExternalLink, Maximize, Minimize, Eye, Calendar, Folder, Plus } from 'lucide-react'
import { YouTubeVideo, Playlist } from '@/types'

interface VideoPlayerModalProps {
  video: YouTubeVideo
  isOpen: boolean
  onClose: () => void
  isSaved: boolean
  onSave: (video: YouTubeVideo) => void
  onUnsave: (videoId: string) => void
  playlists: Playlist[]
  onAddToPlaylist: (video: YouTubeVideo, playlistId: string) => void
  onCreatePlaylist: () => void
}

export default function VideoPlayerModal({
  video,
  isOpen,
  onClose,
  isSaved,
  onSave,
  onUnsave,
  playlists,
  onAddToPlaylist,
  onCreatePlaylist,
}: VideoPlayerModalProps) {
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!isOpen) return null

  const handleSaveClick = () => {
    if (isSaved) {
      onUnsave(video.id)
    } else {
      onSave(video)
    }
  }

  const handleShare = async () => {
    const url = `https://www.youtube.com/watch?v=${video.id}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: `Check out this video: ${video.title}`,
          url: url,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    }
  }

  const openInYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')
  }

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await modalRef.current?.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error('Fullscreen error:', err)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        ref={modalRef}
        className={`relative bg-dark-card overflow-hidden flex flex-col border border-dark-lighter/50 shadow-2xl shadow-black/50 ${
          isFullscreen 
            ? 'w-full h-full rounded-none border-0' 
            : 'w-full max-w-[1400px] h-[75vh] rounded-2xl ring-1 ring-white/10'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-dark-lighter bg-dark-card/95 backdrop-blur-sm flex-shrink-0">
          <h2 className="text-base font-semibold text-white truncate pr-4">Video Player</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleFullscreen}
              className="p-2 text-text-gray hover:text-primary hover:bg-dark-lighter rounded-lg transition-all"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
            <button
              onClick={openInYouTube}
              className="p-2 text-text-gray hover:text-white hover:bg-dark-lighter rounded-lg transition-all"
              title="Open in YouTube"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-text-gray hover:text-white hover:bg-dark-lighter rounded-lg transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main Content - Side by side on large screens */}
        {!isFullscreen ? (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
            {/* Video Player*/}
            <div className="lg:flex-1 h-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>

            {/* Video Info Sidebar */}
            <div className="lg:w-[400px] flex-shrink-0 overflow-y-auto border-l border-dark-lighter bg-dark-card">
              <div className="p-4">
                {/* Title */}
                <h1 className="text-lg font-bold text-white mb-2 leading-snug">
                  {video.title}
                </h1>
                <div className="flex items-center gap-3 text-sm text-text-gray mb-4">
                  {video.views && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {video.views} views
                    </span>
                  )}
                  {video.views && <span>•</span>}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {video.publishedAt}
                  </span>
                </div>

                {/* Channel Info */}
                <div className="flex items-center gap-3 pb-4 border-b border-dark-lighter mb-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-dark font-bold text-base flex-shrink-0">
                    {video.channel.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white text-sm truncate">{video.channel}</h3>
                    <p className="text-xs text-text-gray">Educational Creator</p>
                  </div>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-sm transition-colors flex-shrink-0">
                    Subscribe
                  </button>
                </div>

                {/* Action Buttons - 2x2 Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {/* Save Button */}
                  <button
                    onClick={handleSaveClick}
                    className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-semibold text-sm transition-all ${
                      isSaved
                        ? 'bg-primary text-dark'
                        : 'bg-dark-lighter text-white hover:bg-dark-lighter/80'
                    }`}
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    {isSaved ? 'Saved' : 'Save'}
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 px-3 py-3 bg-dark-lighter text-white rounded-xl font-semibold text-sm hover:bg-dark-lighter/80 transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>

                  {/* Add to Playlist Button */}
                  <div className="relative col-span-2">
                    <button
                      onClick={() => setShowPlaylistMenu(!showPlaylistMenu)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-3 bg-dark-lighter text-white rounded-xl font-semibold text-sm hover:bg-dark-lighter/80 transition-all"
                    >
                      <ListPlus className="w-4 h-4" />
                      Add to Playlist
                    </button>

                    {/* Playlist Dropdown */}
                    {showPlaylistMenu && (
                      <div className="absolute bottom-full left-0 right-0 mb-2 bg-dark border border-dark-lighter rounded-xl shadow-2xl z-10 overflow-hidden">
                        <div className="p-3 border-b border-dark-lighter">
                          <p className="text-sm font-semibold text-white">Add to playlist</p>
                        </div>
                        <div className="max-h-40 overflow-y-auto">
                          {playlists.length === 0 ? (
                            <p className="p-3 text-sm text-text-gray text-center">No playlists yet</p>
                          ) : (
                            playlists.map((playlist) => (
                              <button
                                key={playlist.id}
                                onClick={() => {
                                  onAddToPlaylist(video, playlist.id)
                                  setShowPlaylistMenu(false)
                                }}
                                className="w-full px-4 py-3 text-left text-white hover:bg-dark-lighter transition-colors flex items-center gap-3"
                              >
                                <Folder className="w-4 h-4 text-text-gray" />
                                <span className="truncate text-sm">{playlist.name}</span>
                                <span className="ml-auto text-xs text-text-gray">{playlist.videos.length}</span>
                              </button>
                            ))
                          )}
                        </div>
                        <button
                          onClick={() => {
                            onCreatePlaylist()
                            setShowPlaylistMenu(false)
                          }}
                          className="w-full px-4 py-3 text-left text-primary hover:bg-dark-lighter transition-colors flex items-center gap-3 border-t border-dark-lighter text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Create new playlist</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="bg-dark rounded-xl p-4">
                  <h4 className="font-semibold text-white text-sm mb-2">Description</h4>
                  <p className={`text-text-gray text-sm leading-relaxed ${!isDescriptionExpanded ? 'line-clamp-6' : ''}`}>
                    {video.description || `This video teaches the fundamentals of ${video.title}. It explains key concepts, provides examples, and helps students understand the topic in depth. Perfect for exam preparation and self-study.`}
                  </p>
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="mt-2 text-primary text-sm font-semibold hover:underline"
                  >
                    {isDescriptionExpanded ? 'Show less' : 'Show more'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Fullscreen Video */
          <div className="flex-1 bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </div>
  )
}
