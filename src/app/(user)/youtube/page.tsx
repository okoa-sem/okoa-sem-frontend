'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { FolderOpen } from 'lucide-react'
import { YouTubeVideo, Playlist, SavedVideo } from '@/types'
import { generateDemoVideos } from '@/shared/constants'
import CompactHeader from '@/shared/components/CompactHeader'
import SearchSection from '@/features/youtube/components/SearchSection'
import PopularTopics from '@/features/youtube/components/PopularTopics'
import VideoResults from '@/features/youtube/components/VideoResults'
import EmptyState from '@/features/youtube/components/EmptyState'
import LoadingState from '@/features/youtube/components/LoadingState'
import VideoPlayerModal from '@/features/youtube/components/VideoPlayerModal'
import SavedVideosSidebar from '@/features/youtube/components/SavedVideosSidebar'
import CreatePlaylistModal from '@/features/youtube/components/CreatePlaylistModal'

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''

// localStorage keys
const STORAGE_KEYS = {
  SAVED_VIDEOS: 'okoa_sem_saved_videos',
  PLAYLISTS: 'okoa_sem_playlists',
}

type SearchState = 'idle' | 'loading' | 'results' | 'empty'

export default function YouTubePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentQuery, setCurrentQuery] = useState('')
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [searchState, setSearchState] = useState<SearchState>('idle')
  const resultsRef = useRef<HTMLDivElement>(null)

  
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)

  
  const [savedVideos, setSavedVideos] = useState<SavedVideo[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false)
  const [pendingPlaylistVideo, setPendingPlaylistVideo] = useState<YouTubeVideo | null>(null)

  // Load saved data from localStorage
  useEffect(() => {
    try {
      const savedVideosData = localStorage.getItem(STORAGE_KEYS.SAVED_VIDEOS)
      const playlistsData = localStorage.getItem(STORAGE_KEYS.PLAYLISTS)
      
      if (savedVideosData) {
        setSavedVideos(JSON.parse(savedVideosData))
      }
      if (playlistsData) {
        setPlaylists(JSON.parse(playlistsData))
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error)
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED_VIDEOS, JSON.stringify(savedVideos))
  }, [savedVideos])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists))
  }, [playlists])

  
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      alert('Please enter a search term')
      return
    }

    setCurrentQuery(query)
    setSearchState('loading')

    try {
      if (API_KEY) {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(query + ' tutorial')}&type=video&key=${API_KEY}`
        )

        if (!response.ok) throw new Error('API call failed')

        const data = await response.json()
        
        if (data.items && data.items.length > 0) {
          const formattedVideos: YouTubeVideo[] = data.items.map((item: {
            id: { videoId: string }
            snippet: {
              title: string
              channelTitle: string
              publishedAt: string
              description: string
              thumbnails: { medium: { url: string }, high?: { url: string } }
            }
          }) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
            views: '',
            publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
            description: item.snippet.description,
          }))
          setVideos(formattedVideos)
          setSearchState('results')
        } else {
          setVideos([])
          setSearchState('empty')
        }
      } else {
        const demoVideos = generateDemoVideos(query)
        setVideos(demoVideos)
        setSearchState('results')
      }
    } catch (error) {
      console.error('YouTube API error:', error)
      const demoVideos = generateDemoVideos(query)
      setVideos(demoVideos)
      setSearchState('results')
    }
  }

  const handleSearch = () => performSearch(searchQuery)
  const handleTopicClick = (topic: string) => {
    setSearchQuery(topic)
    performSearch(topic)
  }

  
  const handleVideoClick = (video: YouTubeVideo) => {
    setSelectedVideo(video)
    setIsPlayerOpen(true)
  }

  const handleClosePlayer = () => {
    setIsPlayerOpen(false)
    setSelectedVideo(null)
  }

  
  const handleSaveVideo = useCallback((video: YouTubeVideo) => {
    setSavedVideos(prev => {
      if (prev.some(sv => sv.video.id === video.id)) return prev
      return [...prev, { video, savedAt: new Date() }]
    })
  }, [])

  const handleUnsaveVideo = useCallback((videoId: string) => {
    setSavedVideos(prev => prev.filter(sv => sv.video.id !== videoId))
  }, [])

  
  const handleCreatePlaylist = useCallback((name: string, description?: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      description,
      videos: pendingPlaylistVideo ? [pendingPlaylistVideo] : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setPlaylists(prev => [...prev, newPlaylist])
    setPendingPlaylistVideo(null)
  }, [pendingPlaylistVideo])

  const handleDeletePlaylist = useCallback((playlistId: string) => {
    if (confirm('Are you sure you want to delete this playlist?')) {
      setPlaylists(prev => prev.filter(p => p.id !== playlistId))
    }
  }, [])

  const handleAddToPlaylist = useCallback((video: YouTubeVideo, playlistId: string) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id !== playlistId) return playlist
      if (playlist.videos.some(v => v.id === video.id)) {
        alert('Video already in playlist')
        return playlist
      }
      return {
        ...playlist,
        videos: [...playlist.videos, video],
        updatedAt: new Date(),
      }
    }))
  }, [])

  const handleRemoveFromPlaylist = useCallback((playlistId: string, videoId: string) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id !== playlistId) return playlist
      return {
        ...playlist,
        videos: playlist.videos.filter(v => v.id !== videoId),
        updatedAt: new Date(),
      }
    }))
  }, [])

  const openPlaylistModalForVideo = (video: YouTubeVideo) => {
    setPendingPlaylistVideo(video)
    setIsCreatePlaylistOpen(true)
  }

  const savedVideoIds = savedVideos.map(sv => sv.video.id)

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Navigation Header */}
      <CompactHeader />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-[1600px] mx-auto px-[5%] py-8">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="text-center mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Learn with <span className="text-primary">YouTube</span>
                </h1>
                <p className="text-text-gray text-lg">
                  Search for educational videos to supplement your studies
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-dark-card border-2 border-dark-lighter rounded-xl font-semibold text-white hover:border-primary hover:text-primary transition-all"
            >
              <FolderOpen className="w-5 h-5" />
              <span className="hidden sm:inline">My Library</span>
              {(savedVideos.length > 0 || playlists.length > 0) && (
                <span className="px-2 py-0.5 bg-primary text-dark text-xs rounded-full font-bold">
                  {savedVideos.length + playlists.length}
                </span>
              )}
            </button>
          </div>
          
          <SearchSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
          />
          
          <PopularTopics onTopicClick={handleTopicClick} />
          
          <div ref={resultsRef}>
            {searchState === 'idle' && <EmptyState />}
            
            {searchState === 'loading' && <LoadingState query={currentQuery} />}
            
            {searchState === 'results' && (
              <VideoResults
                videos={videos}
                query={currentQuery}
                onVideoClick={handleVideoClick}
                savedVideoIds={savedVideoIds}
                onSaveVideo={handleSaveVideo}
                onUnsaveVideo={handleUnsaveVideo}
                onAddToPlaylist={openPlaylistModalForVideo}
              />
            )}
            
            {searchState === 'empty' && <EmptyState hasSearched />}
          </div>
        </div>
      </main>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          isOpen={isPlayerOpen}
          onClose={handleClosePlayer}
          isSaved={savedVideoIds.includes(selectedVideo.id)}
          onSave={handleSaveVideo}
          onUnsave={handleUnsaveVideo}
          playlists={playlists}
          onAddToPlaylist={handleAddToPlaylist}
          onCreatePlaylist={() => {
            setPendingPlaylistVideo(selectedVideo)
            setIsCreatePlaylistOpen(true)
          }}
        />
      )}

      {/* Saved Videos Sidebar */}
      <SavedVideosSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        savedVideos={savedVideos}
        playlists={playlists}
        onPlayVideo={(video) => {
          setIsSidebarOpen(false)
          handleVideoClick(video)
        }}
        onRemoveSaved={handleUnsaveVideo}
        onDeletePlaylist={handleDeletePlaylist}
        onRemoveFromPlaylist={handleRemoveFromPlaylist}
      />

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => {
          setIsCreatePlaylistOpen(false)
          setPendingPlaylistVideo(null)
        }}
        onCreate={handleCreatePlaylist}
      />
    </div>
  )
}
