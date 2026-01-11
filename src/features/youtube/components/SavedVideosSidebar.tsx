'use client'

import { useState } from 'react'
import { X, Bookmark, FolderOpen, ChevronRight, Trash2, Play } from 'lucide-react'
import { YouTubeVideo, Playlist, SavedVideo } from '@/types'

interface SavedVideosSidebarProps {
  isOpen: boolean
  onClose: () => void
  savedVideos: SavedVideo[]
  playlists: Playlist[]
  onPlayVideo: (video: YouTubeVideo) => void
  onRemoveSaved: (videoId: string) => void
  onDeletePlaylist: (playlistId: string) => void
  onRemoveFromPlaylist: (playlistId: string, videoId: string) => void
}

type ActiveTab = 'saved' | 'playlists'

export default function SavedVideosSidebar({
  isOpen,
  onClose,
  savedVideos,
  playlists,
  onPlayVideo,
  onRemoveSaved,
  onDeletePlaylist,
  onRemoveFromPlaylist,
}: SavedVideosSidebarProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('saved')
  const [expandedPlaylist, setExpandedPlaylist] = useState<string | null>(null)

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-dark-card border-l border-dark-lighter z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-lighter">
          <h2 className="text-xl font-bold text-white">My Library</h2>
          <button
            onClick={onClose}
            className="p-2 text-text-gray hover:text-white hover:bg-dark-lighter rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-dark-lighter">
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 px-4 py-3 font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'saved'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-gray hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Saved ({savedVideos.length})
          </button>
          <button
            onClick={() => setActiveTab('playlists')}
            className={`flex-1 px-4 py-3 font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'playlists'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-gray hover:text-white'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            Playlists ({playlists.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto h-[calc(100vh-130px)]">
          {activeTab === 'saved' ? (
            // Saved Videos List
            <div className="p-4">
              {savedVideos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-dark-lighter rounded-full flex items-center justify-center">
                    <Bookmark className="w-8 h-8 text-text-gray" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No saved videos</h3>
                  <p className="text-text-gray text-sm">Videos you save will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedVideos.map((saved) => (
                    <div
                      key={saved.video.id}
                      className="group bg-dark rounded-xl p-3 hover:bg-dark-lighter transition-colors"
                    >
                      <div className="flex gap-3">
                        {/* Thumbnail */}
                        <div 
                          className="relative w-28 h-16 bg-dark-lighter rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                          onClick={() => onPlayVideo(saved.video)}
                        >
                          {saved.video.thumbnailUrl ? (
                            <img
                              src={saved.video.thumbnailUrl}
                              alt={saved.video.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              📺
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="w-6 h-6 text-white" />
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 
                            className="text-sm font-semibold text-white line-clamp-2 cursor-pointer hover:text-primary"
                            onClick={() => onPlayVideo(saved.video)}
                          >
                            {saved.video.title}
                          </h4>
                          <p className="text-xs text-text-gray mt-1">{saved.video.channel}</p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => onRemoveSaved(saved.video.id)}
                          className="p-2 text-text-gray hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Playlists List
            <div className="p-4">
              {playlists.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-dark-lighter rounded-full flex items-center justify-center">
                    <FolderOpen className="w-8 h-8 text-text-gray" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No playlists</h3>
                  <p className="text-text-gray text-sm">Create playlists to organize your videos</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {playlists.map((playlist) => (
                    <div key={playlist.id} className="bg-dark rounded-xl overflow-hidden">
                      {/* Playlist Header */}
                      <button
                        onClick={() => setExpandedPlaylist(
                          expandedPlaylist === playlist.id ? null : playlist.id
                        )}
                        className="w-full p-4 flex items-center justify-between hover:bg-dark-lighter transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-dark font-bold">
                            📁
                          </div>
                          <div className="text-left">
                            <h4 className="font-semibold text-white">{playlist.name}</h4>
                            <p className="text-xs text-text-gray">{playlist.videos.length} videos</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeletePlaylist(playlist.id)
                            }}
                            className="p-2 text-text-gray hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <ChevronRight 
                            className={`w-5 h-5 text-text-gray transition-transform ${
                              expandedPlaylist === playlist.id ? 'rotate-90' : ''
                            }`} 
                          />
                        </div>
                      </button>

                      {/* Playlist Videos */}
                      {expandedPlaylist === playlist.id && (
                        <div className="border-t border-dark-lighter">
                          {playlist.videos.length === 0 ? (
                            <p className="p-4 text-sm text-text-gray text-center">No videos in this playlist</p>
                          ) : (
                            playlist.videos.map((video) => (
                              <div
                                key={video.id}
                                className="group flex items-center gap-3 p-3 hover:bg-dark-lighter transition-colors"
                              >
                                <div 
                                  className="relative w-20 h-12 bg-dark-lighter rounded overflow-hidden flex-shrink-0 cursor-pointer"
                                  onClick={() => onPlayVideo(video)}
                                >
                                  {video.thumbnailUrl ? (
                                    <img
                                      src={video.thumbnailUrl}
                                      alt={video.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">📺</div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 
                                    className="text-sm text-white line-clamp-1 cursor-pointer hover:text-primary"
                                    onClick={() => onPlayVideo(video)}
                                  >
                                    {video.title}
                                  </h5>
                                  <p className="text-xs text-text-gray">{video.channel}</p>
                                </div>
                                <button
                                  onClick={() => onRemoveFromPlaylist(playlist.id, video.id)}
                                  className="p-1 text-text-gray hover:text-red-500 opacity-0 group-hover:opacity-100"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
