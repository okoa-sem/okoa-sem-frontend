'use client'

import { useState, useMemo } from 'react'
import { MarkingScheme, PastPaper } from '@/types'
import { FileText, Trash2, Eye, Download, Search, History } from 'lucide-react'

interface MarkingSchemeHistoryProps {
  schemes: MarkingScheme[]
  onDelete?: (id: string) => void
  onViewDetail: (scheme: MarkingScheme) => void
}

export default function MarkingSchemeHistory({ 
  schemes, 
  onDelete, 
  onViewDetail 
}: MarkingSchemeHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest')

  const filteredAndSortedSchemes = useMemo(() => {
    let filtered = schemes

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(scheme => 
        scheme.paper?.courseCode.toLowerCase().includes(query) ||
        scheme.paper?.courseName.toLowerCase().includes(query)
      )
    }

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()

      if (sortBy === 'newest') return dateB - dateA
      if (sortBy === 'oldest') return dateA - dateB
      if (sortBy === 'name') {
        return (a.paper?.courseName || '').localeCompare(b.paper?.courseName || '')
      }
      return 0
    })

    return sorted
  }, [schemes, searchQuery, sortBy])

  if (schemes.length === 0) {
    return (
      <div className="bg-dark-card border border-dark-lighter rounded-xl p-12 text-center">
        <div className="w-20 h-20 rounded-2xl bg-dark-lighter mx-auto mb-6 flex items-center justify-center">
          <FileText className="w-10 h-10 text-text-gray" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">
          No Marking Schemes Yet
        </h3>
        <p className="text-text-gray max-w-md mx-auto">
          You haven't generated any marking schemes yet. Browse past papers and click 
          the "Generate Answers" button to generate one.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Added Header to identify the section clearly */}
      <div className="flex items-center gap-3 pb-2 border-b border-dark-lighter">
        <History className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold text-white">Marking Scheme History</h2>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-gray" />
          <input
            type="text"
            placeholder="Search by course code or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-dark-card border border-dark-lighter rounded-lg text-white placeholder-text-gray focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-text-gray text-sm">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-dark-card border border-dark-lighter rounded-lg text-white text-sm focus:outline-none focus:border-primary transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="text-text-gray text-sm mb-4">
        Showing <span className="text-primary font-semibold">{filteredAndSortedSchemes.length}</span> marking schemes
      </div>

      {/* Marking Schemes List */}
      <div className="space-y-3">
        {filteredAndSortedSchemes.length === 0 ? (
          <div className="bg-dark-card border border-dark-lighter rounded-xl p-8 text-center">
            <p className="text-text-gray">No marking schemes match your search.</p>
          </div>
        ) : (
          filteredAndSortedSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-dark-card border border-dark-lighter rounded-xl p-4 hover:border-primary/50 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                {/* Paper Info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-dark-lighter flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-amber-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-base mb-1 truncate">
                      {scheme.paper?.courseCode} - {scheme.paper?.courseName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-md text-xs font-medium">
                        Marking Scheme
                      </span>
                      <span className="text-text-gray">•</span>
                      <span className="text-text-gray">{scheme.paper?.year}</span>
                      <span className="text-text-gray">•</span>
                      <span className="text-text-gray">
                        {scheme.paper?.semester === 'first' ? 'Semester 1' : 'Semester 2'}
                      </span>
                      <span className="text-text-gray hidden sm:inline">•</span>
                      <span className="text-text-gray hidden sm:inline">
                        {new Date(scheme.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => onViewDetail(scheme)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-dark-lighter text-white rounded-lg font-medium text-sm hover:bg-dark-lighter/80 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">View</span>
                  </button>
                  
                  {onDelete && (
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this marking scheme?')) {
                          onDelete(scheme.id)
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-red-500/20 text-red-400 rounded-lg font-medium text-sm hover:bg-red-500/30 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Award icon component
function Award({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8 14 12 17 16 14" />
      <line x1="12" y1="17" x2="12" y2="23" />
      <line x1="4" y1="21" x2="20" y2="21" />
    </svg>
  )
}