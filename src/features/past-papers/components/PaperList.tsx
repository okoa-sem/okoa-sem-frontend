'use client'

import { PastPaper } from '@/types'
import PaperCard from './PaperCard'

interface PaperListProps {
  papers: PastPaper[]
  onPreview: (paper: PastPaper) => void
  onUploadToAI: (paper: PastPaper) => void
  onGenerateMarkingScheme: (paper: PastPaper) => void
}

export default function PaperList({ papers, onPreview, onUploadToAI, onGenerateMarkingScheme }: PaperListProps) {
  if (papers.length === 0) {
    return (
      <div className="bg-dark-card border border-dark-lighter rounded-xl p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-dark-lighter mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-text-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Papers Found</h3>
        <p className="text-text-gray text-sm max-w-md mx-auto">
          No past papers match your current filters. Try adjusting your search criteria or selecting a different year.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Results summary */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-text-gray text-sm">
          Showing <span className="text-primary font-semibold">{papers.length}</span> past papers
        </p>
      </div>

      {/* Papers list */}
      <div className="space-y-3">
        {papers.map((paper, index) => (
          <PaperCard
            key={paper.id}
            paper={paper}
            onPreview={onPreview}
            onGenerateMarkingScheme={onGenerateMarkingScheme}
            onUploadToAI={onUploadToAI}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}
