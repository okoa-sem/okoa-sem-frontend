'use client'

import { FileText } from 'lucide-react'

interface EmptyStateProps {
  schoolName: string
  hasSelectedYear: boolean
}

export default function EmptyState({ schoolName, hasSelectedYear }: EmptyStateProps) {
  return (
    <div className="bg-dark-card border border-dark-lighter rounded-2xl p-12 text-center">
      <div className="w-20 h-20 rounded-2xl bg-dark-lighter mx-auto mb-6 flex items-center justify-center">
        <FileText className="w-10 h-10 text-text-gray" />
      </div>
      
      {!hasSelectedYear ? (
        <>
          <h3 className="text-xl font-semibold text-white mb-3">
            Select a Year to View Papers
          </h3>
          <p className="text-text-gray max-w-md mx-auto">
            Choose a year from the dropdown above to browse all past papers 
            from the {schoolName}.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-white mb-3">
            No Papers Available
          </h3>
          <p className="text-text-gray max-w-md mx-auto">
            There are no past papers available for this selection. 
            Try selecting a different year or school.
          </p>
        </>
      )}
    </div>
  )
}
