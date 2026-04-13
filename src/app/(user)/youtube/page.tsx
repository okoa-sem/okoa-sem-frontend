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
import Pagination from '@/shared/components/Pagination'
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setQuery } from '@/features/youtube/slices/youtube.slice';
import { searchVideos } from '@/features/youtube/api/search'

// localStorage keys
const STORAGE_KEYS = {
  SAVED_VIDEOS: 'okoa_sem_saved_videos',
  PLAYLISTS: 'okoa_sem_playlists',
}

type SearchState = 'idle' | 'loading' | 'results' | 'empty'

export default function YouTubePage() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.youtube.query);
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [searchState, setSearchState] = useState<SearchState>('idle')
  const resultsRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [nextPageToken, setNextPageToken] = useState<string>('')
  const [searchHistory, setSearchHistory] = useState<Map<string, { videos: YouTubeVideo[]; token: string }>>(new Map())

  
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

  const performSearch = async (query: string, pageToken?: string) => {
    if (!query.trim()) {
      alert('Please enter a search term')
      return
    }

    setSearchState('loading')

    try {
      const response = await searchVideos({
        q: query,
        max_results: 20,
        order: 'relevance',
        ...(pageToken && { page_token: pageToken }),
      })

      if (response.success && response.data.videos && response.data.videos.length > 0) {
        const formattedVideos: YouTubeVideo[] = response.data.videos.map(video => ({
          id: video.id,
          title: video.title,
          channel: video.channel_title,
          thumbnailUrl: video.thumbnail_url,
          views: video.view_count,
          publishedAt: new Date(video.published_at).toLocaleDateString(),
          description: video.description,
          duration: video.duration,
        }))
        setVideos(formattedVideos)
        setNextPageToken(response.data.next_page_token || '')
        setSearchState('results')
      } else {
        setVideos([])
        setSearchState('empty')
      }
    } catch (error) {
      console.error('Search error:', error)
      alert('Error searching videos. Please try again.')
      setSearchState('empty')
    }
  }

  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(0)
      setNextPageToken('')
      performSearch(searchQuery);
    }
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    // For now, we support next page navigation using page_token
    // Page 0 is always the first search, page > 0 uses the next_page_token
    if (page === 0) {
      setCurrentPage(0)
      setNextPageToken('')
      performSearch(searchQuery)
    } else if (page > currentPage && nextPageToken) {
      // Going to next page
      setCurrentPage(page)
      performSearch(searchQuery, nextPageToken)
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleSearch = () => {
    setCurrentPage(0)
    setNextPageToken('')
    performSearch(searchQuery)
  }
  const handleTopicClick = (topic: string) => {
    dispatch(setQuery(topic));
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
            onSearch={handleSearch}
          />
          
          <PopularTopics onTopicClick={handleTopicClick} />
          
          <div ref={resultsRef}>
            {searchState === 'idle' && <EmptyState />}
            
            {searchState === 'loading' && <LoadingState query={searchQuery} />}
            
            {searchState === 'results' && (
              <>
                <VideoResults
                  videos={videos}
                  query={searchQuery}
                  onVideoClick={handleVideoClick}
                  savedVideoIds={savedVideoIds}
                  onSaveVideo={handleSaveVideo}
                  onUnsaveVideo={handleUnsaveVideo}
                  onAddToPlaylist={openPlaylistModalForVideo}
                />
                {nextPageToken && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={currentPage + 2}
                    onPageChange={handlePageChange}
                    isLoading={false}
                  />
                )}
              </>
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
