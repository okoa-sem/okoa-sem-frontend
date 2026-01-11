'use client'

import { Search, X } from 'lucide-react'

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  placeholder?: string
  resultsCount?: number
}

export default function SearchBar({ 
  searchQuery, 
  onSearchChange, 
  placeholder = "Search by course code, name, or keyword...",
  resultsCount
}: SearchBarProps) {
  return (
    <div className="mb-6">
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-gray" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="search-input w-full pl-12 pr-12 py-4 bg-dark-card border-2 border-dark-lighter rounded-xl text-white placeholder:text-text-gray focus:outline-none focus:border-primary transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-dark-lighter flex items-center justify-center text-text-gray hover:text-white hover:bg-primary hover:text-dark transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {resultsCount !== undefined && searchQuery && (
        <p className="mt-2 text-sm text-text-gray">
          Found <span className="text-primary font-semibold">{resultsCount}</span> results for &quot;{searchQuery}&quot;
        </p>
      )}
    </div>
  )
}
