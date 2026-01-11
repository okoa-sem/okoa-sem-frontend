'use client'

import { useState } from 'react'
import { X, Loader, Check } from 'lucide-react'
import { PastPaper, MarkingScheme } from '@/types'

interface GenerateMarkingSchemeModalProps {
  paper: PastPaper | null
  isOpen: boolean
  onClose: () => void
  onGenerate: (paper: PastPaper, markingScheme: MarkingScheme) => Promise<void>
}

export default function GenerateMarkingSchemeModal({ 
  paper, 
  isOpen, 
  onClose, 
  onGenerate 
}: GenerateMarkingSchemeModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen || !paper) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose()
    }
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create a mock marking scheme
      const mockMarkingScheme: MarkingScheme = {
        id: `ms_${Date.now()}`,
        userId: 'current-user', 
        paperId: paper.id,
        paper,
        content: `# Marking Scheme for ${paper.courseCode}\n\n## ${paper.courseName}\n\n**Exam Type:** ${paper.examType}\n**Year:** ${paper.year}\n**Semester:** ${paper.semester === 'first' ? 'First' : 'Second'}\n\n## Section A\n- Question 1: (10 marks)\n- Question 2: (10 marks)\n- Question 3: (10 marks)\n\n## Section B\n- Question 4: (15 marks)\n- Question 5: (15 marks)\n\n## Marking Guidelines\n1. Award marks based on correct answers\n2. Partial credit may be given for working\n3. Grammar and presentation: up to 2 bonus marks`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await onGenerate(paper, mockMarkingScheme)
      setIsSuccess(true)

      // Auto-close after success
      setTimeout(() => {
        onClose()
        setIsSuccess(false)
      }, 3000) // Increased timeout slightly so they can read the message
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate marking scheme')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-dark-card w-full max-w-md rounded-2xl overflow-hidden border border-dark-lighter shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-lighter">
          <h2 className="text-xl font-bold text-white">
            Generate Marking Scheme
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-text-gray hover:text-white hover:bg-dark-lighter rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Paper Info */}
          <div className="bg-dark rounded-lg p-4 space-y-2">
            <div>
              <p className="text-text-gray text-sm">Course Code</p>
              <p className="text-white font-semibold">{paper.courseCode}</p>
            </div>
            <div>
              <p className="text-text-gray text-sm">Course Name</p>
              <p className="text-white font-semibold">{paper.courseName}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-text-gray text-sm">Year</p>
                <p className="text-white">{paper.year}</p>
              </div>
              <div>
                <p className="text-text-gray text-sm">Semester</p>
                <p className="text-white">{paper.semester === 'first' ? 'First' : 'Second'}</p>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {isSuccess && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 flex items-start gap-2">
              <Check className="w-4 h-4 text-green-400 mt-0.5" />
              <p className="text-green-400 text-sm">
                Marking scheme generated successfully! You can find this in your Marking Scheme History.
              </p>
            </div>
          )}

          {isLoading && !isSuccess && (
            <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-3 flex items-center gap-2">
              <Loader className="w-4 h-4 text-amber-400 animate-spin" />
              <p className="text-amber-400 text-sm">Generating marking scheme...</p>
            </div>
          )}

          {/* Info Text */}
          {!isLoading && !isSuccess && (
            <p className="text-text-gray text-sm">
              Click the button below to generate a marking scheme for this paper. The generated scheme will be saved to your marking scheme history.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-dark-lighter">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-dark-lighter text-white rounded-lg font-medium hover:bg-dark-lighter/80 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSuccess ? 'Done' : 'Cancel'}
          </button>
          <button
            onClick={handleGenerate}
            disabled={isLoading || isSuccess}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-dark rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : isSuccess ? (
              <>
                <Check className="w-4 h-4" />
                Generated
              </>
            ) : (
              'Generate'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}