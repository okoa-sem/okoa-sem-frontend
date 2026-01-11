'use client'

import { Search } from 'lucide-react'

interface SearchSectionProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSearch: () => void
}

export default function SearchSection({ searchQuery, setSearchQuery, onSearch }: SearchSectionProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  return (
    <div className="bg-dark-card p-4 md:p-6 rounded-2xl border-2 border-dark-lighter mb-6 backdrop-blur-xl opacity-95">
      <div className="flex flex-col sm:flex-row gap-3 max-w-[900px] mx-auto">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for topics like 'calculus', 'physics', or 'programming'..."
          className="flex-1 px-5 py-3.5 bg-dark border-2 border-dark-lighter rounded-xl text-white placeholder:text-text-gray focus:outline-none focus:border-primary transition-colors"
        />
        <button
          onClick={onSearch}
          className="px-6 py-3.5 bg-primary text-dark rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:bg-primary-dark hover:-translate-y-0.5 whitespace-nowrap"
        >
          <Search className="w-5 h-5" />
          Search
        </button>
      </div>
    </div>
  )
}
