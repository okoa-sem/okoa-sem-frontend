'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface CreatePlaylistModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (name: string, description?: string) => void
}

export default function CreatePlaylistModal({
  isOpen,
  onClose,
  onCreate,
}: CreatePlaylistModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('Please enter a playlist name')
      return
    }
    onCreate(name.trim(), description.trim() || undefined)
    setName('')
    setDescription('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-dark-card rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-lighter">
          <h2 className="text-lg font-bold text-white">Create Playlist</h2>
          <button
            onClick={onClose}
            className="p-2 text-text-gray hover:text-white hover:bg-dark-lighter rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-white mb-2">
              Playlist Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Calculus Tutorials"
              className="w-full px-4 py-3 bg-dark border-2 border-dark-lighter rounded-xl text-white placeholder:text-text-gray focus:outline-none focus:border-primary transition-colors"
              autoFocus
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this playlist about?"
              rows={3}
              className="w-full px-4 py-3 bg-dark border-2 border-dark-lighter rounded-xl text-white placeholder:text-text-gray focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-dark-lighter text-white rounded-xl font-semibold hover:bg-dark-lighter/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary text-dark rounded-xl font-semibold hover:bg-primary-dark transition-colors"
            >
              Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
