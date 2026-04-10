'use client'

import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { useAppDispatch } from '@/store/hooks'
import { setQuery } from '../slices/youtube.slice'
import { useState } from 'react'

interface SearchSectionProps {
  onSearch: () => void
}

export default function SearchSection({ onSearch }: SearchSectionProps) {
  const dispatch = useAppDispatch()
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = () => {
    dispatch(setQuery(searchTerm))
    onSearch()
  }

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="relative">
        <Input
          type="search"
          placeholder="Search for tutorials, topics, etc..."
          className="w-full p-6 text-lg bg-dark-card border-2 border-dark-lighter focus:border-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button
          onClick={handleSearch}
          className="absolute right-4 top-1/2 -translate-y-1/2 px-6 py-3"
        >
          Search
        </Button>
      </div>
    </div>
  )
}
