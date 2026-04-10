'use client'

import { useState, useCallback } from 'react'
import CompactHeader from '@/shared/components/CompactHeader'
import MarkingSchemeHistory from '@/features/marking-schemes/components/MarkingSchemeHistory'
import MarkingSchemeDetail from '@/features/marking-schemes/components/MarkingSchemeDetail'
import { useMarkingSchemes, useDeleteMarkingScheme } from '@/features/marking-schemes/hooks'
import { MarkingScheme } from '@/types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function MarkingSchemesPage() {
  const [selectedScheme, setSelectedScheme] = useState<MarkingScheme | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Read from localStorage via updated hook
  const { data: localSchemes = [], isLoading } = useMarkingSchemes()
  const deleteMarkingScheme = useDeleteMarkingScheme()

  // Map LocalMarkingScheme → MarkingScheme (used by existing UI components)
  const markingSchemes: MarkingScheme[] = localSchemes.map((s) => ({
    id: s.id,
    userId: 'current-user',
    paperId: s.paperId,
    paper: {
      id: s.paperId,
      title: `${s.paperCode} - ${s.paperTitle}`,
      courseCode: s.paperCode,
      courseName: s.paperTitle,
      school: '',
      year: s.paperYear,
      semester: s.paperSemester as 'first' | 'second' | 'unknown',
      examType: s.paperExamType as 'main' | 'supplementary' | 'special' | 'cat',
      fileUrl: '',
      fileSize: 0,
      uploadedAt: new Date(s.createdAt),
      downloads: 0,
    },
    content: s.content,
    createdAt: new Date(s.createdAt),
    updatedAt: new Date(s.updatedAt),
  }))

  const handleViewDetail = useCallback((scheme: MarkingScheme) => {
    setSelectedScheme(scheme)
    setIsDetailOpen(true)
  }, [])

  const handleDeleteScheme = useCallback(
    async (id: string) => {
      try {
        await deleteMarkingScheme.mutateAsync(id)
      } catch (err) {
        console.error('Failed to delete marking scheme:', err)
      }
    },
    [deleteMarkingScheme]
  )

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false)
    setTimeout(() => setSelectedScheme(null), 300)
  }, [])

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <CompactHeader />

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
                My <span className="text-primary">Marking Schemes</span>
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
          ) : markingSchemes.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-text-gray text-lg mb-4">No marking schemes generated yet</p>
                <Link
                  href="/past-papers"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-dark font-semibold hover:bg-primary/90 transition-colors"
                >
                  Generate Now
                </Link>
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

      <MarkingSchemeDetail
        scheme={selectedScheme}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </div>
  )
}