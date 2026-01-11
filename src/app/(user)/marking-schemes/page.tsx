'use client'

import { useState, useEffect, useCallback } from 'react'
import { MarkingScheme } from '@/types'
import CompactHeader from '@/shared/components/CompactHeader'
import MarkingSchemeHistory from '@/features/marking-schemes/components/MarkingSchemeHistory'
import MarkingSchemeDetail from '@/features/marking-schemes/components/MarkingSchemeDetail'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function MarkingSchemesPage() {
  const [markingSchemes, setMarkingSchemes] = useState<MarkingScheme[]>([])
  const [selectedScheme, setSelectedScheme] = useState<MarkingScheme | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  
  useEffect(() => {
    const loadSchemes = async () => {
      try {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Load from localStorage
        const stored = localStorage.getItem('marking-schemes')
        if (stored) {
          const schemes = JSON.parse(stored)
          setMarkingSchemes(schemes)
        }
      } catch (err) {
        console.error('Failed to load marking schemes:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadSchemes()
  }, [])

  const handleViewDetail = useCallback((scheme: MarkingScheme) => {
    setSelectedScheme(scheme)
    setIsDetailOpen(true)
  }, [])

  const handleDeleteScheme = useCallback((id: string) => {
    setMarkingSchemes(prev => prev.filter(s => s.id !== id))
    
    // Update localStorage
    const remaining = markingSchemes.filter(s => s.id !== id)
    localStorage.setItem('marking-schemes', JSON.stringify(remaining))
  }, [markingSchemes])

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false)
    setTimeout(() => setSelectedScheme(null), 300)
  }, [])

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Navigation Header */}
      <CompactHeader />
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 md:px-[5%] py-8">
          {/* Page Header */}
          <div className="mb-8">
            <Link 
              href="/past-papers" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Past Papers</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                My <span className="text-amber-400">Marking Schemes</span>
              </h1>
              <p className="text-text-gray text-lg max-w-2xl mx-auto">
                View and manage all the marking schemes you've generated for past papers.
              </p>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border-4 border-dark-lighter border-t-primary mx-auto mb-4 animate-spin" />
                <p className="text-text-gray">Loading your marking schemes...</p>
              </div>
            </div>
          ) : (
            <MarkingSchemeHistory
              schemes={markingSchemes}
              onViewDetail={handleViewDetail}
              onDelete={handleDeleteScheme}
            />
          )}
        </div>
      </main>

      {/* Detail Modal */}
      <MarkingSchemeDetail
        scheme={selectedScheme}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </div>
  )
}
