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
    <div className="mb-6" style={{ position: 'relative', zIndex: 10 } as React.CSSProperties}>
      <div className="relative max-w-2xl pointer-events-auto" style={{ WebkitTouchCallout: 'none' } as React.CSSProperties}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-gray pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={(e) => {
            // Prevent zoom on iOS when focusing
            e.currentTarget.style.fontSize = '16px'
          }}
          onTouchStart={(e) => {
            // Explicitly handle touch for iOS
            e.currentTarget.focus()
          }}
          placeholder={placeholder}
          className="search-input w-full pl-12 pr-12 py-4 bg-dark-card border-2 border-dark-lighter rounded-xl text-white placeholder:text-text-gray focus:outline-none focus:border-primary transition-colors text-base pointer-events-auto"
          style={{ WebkitUserSelect: 'text', WebkitTouchCallout: 'none' } as React.CSSProperties}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          inputMode="search"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-dark-lighter flex items-center justify-center text-text-gray hover:text-white hover:bg-primary hover:text-dark transition-colors pointer-events-auto"
            style={{ WebkitTouchCallout: 'none' } as React.CSSProperties}
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
