'use client'

import { useState, useEffect } from 'react'
import { X, Loader, Check, AlertCircle, MessageCircle } from 'lucide-react'
import { PastPaper, MarkingScheme } from '@/types'
import { useGenerateMarkingScheme, useCheckMarkingSchemeStatus, useMarkingSchemes } from '@/features/marking-schemes/hooks'
import { MarkingSchemeContent } from '@/features/marking-schemes/types'
import Link from 'next/link'

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
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attemptCount, setAttemptCount] = useState(0)
  const [waitingForGeneration, setWaitingForGeneration] = useState(false)

  // Mutation for initiating generation
  const generateMutation = useGenerateMarkingScheme()

  // Query for polling status
  const statusQuery = useCheckMarkingSchemeStatus(sessionId)

  // Fetch all marking schemes as a fallback
  const { data: allSchemes = [], refetch: refetchSchemes } = useMarkingSchemes()

  // Auto-close after success - but give user time to click buttons
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        onClose()
        setIsSuccess(false)
        setSessionId(null)
        setAttemptCount(0)
        setWaitingForGeneration(false)
      }, 5000) // Increased to 5 seconds to let user click buttons
      return () => clearTimeout(timer)
    }
  }, [isSuccess, onClose])

  // Handle status updates
  useEffect(() => {
    if (!statusQuery.data) return

    const { status, generatedMarkingScheme } = statusQuery.data

    if (status === 'COMPLETED' && generatedMarkingScheme && paper) {
      // Convert API response to MarkingScheme type for the callback
      const markingScheme: MarkingScheme = {
        id: generatedMarkingScheme.id,
        userId: 'current-user',
        paperId: paper.id,
        paper,
        content: generatedMarkingScheme.content,
        createdAt: new Date(generatedMarkingScheme.createdAt),
        updatedAt: new Date(generatedMarkingScheme.updatedAt),
      }

      onGenerate(paper, markingScheme)
        .then(() => {
          setIsSuccess(true)
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Failed to save marking scheme')
        })
    } else if (status === 'FAILED') {
      setError('Marking scheme generation failed. Please try again.')
      setSessionId(null)
    }
  }, [statusQuery.data, paper, onGenerate])

  // Handle generation errors
  useEffect(() => {
    if (generateMutation.error) {
      const errorMsg = generateMutation.error instanceof Error
        ? generateMutation.error.message
        : 'Failed to start marking scheme generation'
      console.error('Generate mutation error:', generateMutation.error)
      setError(errorMsg)
    }
  }, [generateMutation.error])

  // Fallback: If status check keeps failing, wait and then fetch all schemes
  useEffect(() => {
    if (statusQuery.isError && !waitingForGeneration) {
      const newAttempt = attemptCount + 1
      setAttemptCount(newAttempt)
      
      console.error(`Status check failed (attempt ${newAttempt}):`, statusQuery.error)
      
      // After 3 failed attempts, switch to fallback strategy
      if (newAttempt >= 3) {
        console.log('Switching to fallback strategy: checking all marking schemes')
        setWaitingForGeneration(true)
        
        // Wait a bit then refetch all schemes
        const timer = setTimeout(() => {
          refetchSchemes().then(result => {
            if (result.data && paper) {
              // Look for a marking scheme that was just created for this paper
              const newScheme = result.data.find(
                (scheme: any) => scheme.examPaperId === parseInt(paper.id.toString(), 10)
              )
              
              if (newScheme) {
                const markingScheme: MarkingScheme = {
                  id: newScheme.id,
                  userId: 'current-user',
                  paperId: paper.id,
                  paper,
                  content: newScheme.content,
                  createdAt: new Date(newScheme.createdAt),
                  updatedAt: new Date(newScheme.updatedAt),
                }
                
                onGenerate(paper, markingScheme)
                  .then(() => {
                    setIsSuccess(true)
                  })
                  .catch((err) => {
                    setError(err instanceof Error ? err.message : 'Failed to save marking scheme')
                  })
              }
            }
          })
        }, 2000)
        
        return () => clearTimeout(timer)
      }
    }
  }, [statusQuery.isError, statusQuery.error, attemptCount, waitingForGeneration, paper, onGenerate, refetchSchemes])

  if (!isOpen || !paper) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !generateMutation.isPending && !statusQuery.isLoading) {
      onClose()
      setSessionId(null)
      setError(null)
      setAttemptCount(0)
    }
  }

  const handleGenerate = async () => {
    setError(null)
    setAttemptCount(0)
    try {
      // Paper ID is typically a string in the UI, but the API expects a number
      const paperIdNum = typeof paper.id === 'string' ? parseInt(paper.id, 10) : paper.id
      console.log('Generating marking scheme for paper ID:', paperIdNum)
      const result = await generateMutation.mutateAsync(paperIdNum)
      console.log('Generation started with session ID:', result.sessionId)
      setSessionId(result.sessionId)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate marking scheme'
      console.error('Error generating marking scheme:', err)
      setError(msg)
    }
  }

  const isLoading = generateMutation.isPending || statusQuery.isLoading
  const isGenerating = sessionId !== null && !isSuccess

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
            className="p-1.5 rounded-lg hover:bg-dark-lighter transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-text-gray" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Paper Info */}
          <div className="space-y-2">
            <p className="text-sm text-text-gray">Exam Paper</p>
            <p className="text-lg font-semibold text-white">{paper.courseCode}</p>
            <p className="text-sm text-text-gray">{paper.courseName}</p>
            <div className="flex gap-4 text-xs text-text-gray pt-2">
              <span>{paper.year}</span>
              <span>•</span>
              <span>
                {paper.semester === 'first' ? 'Semester 1' : 'Semester 2'}
              </span>
              <span>•</span>
              <span className="capitalize">{paper.examType}</span>
            </div>
          </div>

          {/* Status Display */}
          {isGenerating && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Loader className="w-5 h-5 text-primary animate-spin" />
                <div>
                  <p className="font-medium text-white">
                    {statusQuery.data?.status === 'PROCESSING'
                      ? 'Processing...'
                      : 'Generating Marking Scheme...'}
                  </p>
                  <p className="text-xs text-text-gray">
                    {statusQuery.data?.message ||
                      'This may take a moment'}
                  </p>
                </div>
              </div>
              <div className="w-full bg-dark rounded-full h-1 overflow-hidden">
                <div className="bg-primary h-full w-2/3 animate-pulse" />
              </div>
            </div>
          )}

          {/* Success State */}
          {isSuccess && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-white">Marking Scheme Generated!</p>
                  <p className="text-xs text-text-gray">What would you like to do next?</p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isGenerating && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-dark-lighter px-6 py-4">
          {isSuccess ? (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg border border-dark-lighter text-text-gray hover:bg-dark-lighter transition-colors"
              >
                Close
              </button>
              <Link
                href={`/chatbot?paper=${paper?.id}&code=${encodeURIComponent(paper?.courseCode || '')}&title=${encodeURIComponent(paper?.courseName || '')}`}
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-dark font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Go to Chatbot
              </Link>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg border border-dark-lighter text-text-gray hover:bg-dark-lighter transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-dark font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}