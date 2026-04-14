'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Loader, Check, AlertCircle, MessageCircle, RefreshCw } from 'lucide-react'
import { PastPaper, MarkingScheme } from '@/types'
import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/core/http/client'
import { MarkingSchemeContent, MarkingSchemeStatusData } from '@/features/marking-schemes/types'
import { markingSchemeStorage } from '@/features/marking-schemes/utils/markingSchemeStorage'
import { markingSchemeKeys } from '@/features/marking-schemes/hooks'
import { chatService } from '@/features/chatbot/services/chatService'

interface GenerateMarkingSchemeModalProps {
  paper: PastPaper | null
  isOpen: boolean
  onClose: () => void
  onGenerate: (paper: PastPaper, markingScheme: MarkingScheme) => Promise<void>
}

type ModalState = 'idle' | 'starting' | 'waiting' | 'success' | 'error'

const POLL_INTERVAL_MS = 4000
const MAX_BACKGROUND_POLLS = 15

export default function GenerateMarkingSchemeModal({
  paper,
  isOpen,
  onClose,
  onGenerate,
}: GenerateMarkingSchemeModalProps) {
  const [modalState, setModalState] = useState<ModalState>('idle')
  const [error, setError] = useState<string | null>(null)

  const pollTimerRef = useRef<NodeJS.Timeout | null>(null)
  const pollCountRef = useRef(0)
  const activeRef = useRef(false)

  const queryClient = useQueryClient()

  // ─── Save to localStorage ─────────────────────────────────────────────────

  const saveToLocalStorage = useCallback(
    (content: string) => {
      if (!paper) return
      const now = new Date().toISOString()
      markingSchemeStorage.save({
        id: `ms_${paper.id}_${Date.now()}`,
        paperId: paper.id,
        paperCode: paper.courseCode,
        paperTitle: paper.courseName,
        paperYear: paper.year,
        paperSemester: paper.semester,
        paperExamType: paper.examType,
        content,
        createdAt: now,
        updatedAt: now,
      })
      // Invalidate the cached list so MarkingSchemesPage always sees the new
      // scheme on its first render — avoids stale-cache misses when navigating
      // from a previously-visited marking-schemes page.
      queryClient.invalidateQueries({ queryKey: markingSchemeKeys.lists() })
    },
    [paper, queryClient]
  )

  // ─── Cleanup ──────────────────────────────────────────────────────────────

  const stopPolling = useCallback(() => {
    activeRef.current = false
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current)
      pollTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!isOpen) {
      stopPolling()
      setModalState('idle')
      setError(null)
      pollCountRef.current = 0
    }
  }, [isOpen, stopPolling])

  useEffect(() => {
    return () => stopPolling()
  }, [stopPolling])

  // ─── Success handler ──────────────────────────────────────────────────────

  const markSuccess = useCallback(
    (scheme?: MarkingSchemeContent) => {
      stopPolling()

      if (!paper) {
        setModalState('success')
        return
      }

      if (scheme?.content) {
        // Content already available from API
        saveToLocalStorage(scheme.content)

        // Also call onGenerate for any parent-level side effects
        const markingScheme: MarkingScheme = {
          id: scheme.id,
          userId: 'current-user',
          paperId: paper.id,
          paper,
          content: scheme.content,
          createdAt: new Date(scheme.createdAt),
          updatedAt: new Date(scheme.updatedAt),
        }
        onGenerate(paper, markingScheme).catch(() => {})
        setModalState('success')
      } else {
        // No content in API response yet - fetch from chat session
        // This ensures content is available even if user doesn't navigate to chatbot
        // Add a small delay to allow backend to create the session
        setTimeout(() => {
          chatService
            .getAllSessions()
            .then((sessions) => {
              const sessionTitle = `${paper.courseCode} - ${paper.courseName}`
              const existing = sessions.find(
                (s) =>
                  s.title === sessionTitle ||
                  (paper.courseCode && s.title.includes(paper.courseCode))
              )

              if (existing) {
                return chatService.getSessionById(existing.sessionId)
              }
              return null
            })
            .then((detail) => {
              if (detail?.messages?.length) {
                const assistantMsgs = detail.messages.filter(m => m.role === 'ASSISTANT')
                if (assistantMsgs.length > 0) {
                  const content = assistantMsgs.map(m => m.content).join('\n\n')
                  saveToLocalStorage(content)
                } else {
                  // If still no assistant messages, save empty stub
                  saveToLocalStorage('')
                }
              } else {
                // No messages found, save empty stub
                saveToLocalStorage('')
              }
              // Mark as success only after we've fetched and saved the content
              setModalState('success')
            })
            .catch(() => {
              // If fetch fails, save empty stub so it appears in list
              saveToLocalStorage('')
              setModalState('success')
            })
        }, 1000)  // Wait 1 second for backend to create session and generate content
      }
    },
    [paper, onGenerate, stopPolling, saveToLocalStorage]
  )

  // ─── Background polling ───────────────────────────────────────────────────

  const startBackgroundPolling = useCallback(
    (sid: string) => {
      activeRef.current = true
      pollCountRef.current = 0

      const poll = async () => {
        if (!activeRef.current) return
        pollCountRef.current += 1

        // Try status endpoint
        try {
          const res = await httpClient.get<{
            success: boolean
            data: MarkingSchemeStatusData
          }>(`/marking-schemes/status/${sid}`)

          const data = res.data?.data
          if (data?.status === 'COMPLETED' && data.generatedMarkingScheme) {
            markSuccess(data.generatedMarkingScheme)
            return
          }
          if (data?.status === 'FAILED') {
            stopPolling()
            setError('Generation failed on the server. Please try again.')
            setModalState('error')
            return
          }
        } catch {
          // 500 — continue polling
        }

        // Every 3 polls, try the list endpoint as fallback
        if (pollCountRef.current % 3 === 0 && paper) {
          try {
            const res = await httpClient.get<{
              success: boolean
              data: { markingSchemes: MarkingSchemeContent[] }
            }>('/marking-schemes')

            const paperId =
              typeof paper.id === 'string' ? parseInt(paper.id, 10) : paper.id
            const found = (res.data?.data?.markingSchemes ?? []).find(
              (s) => s.examPaperId === paperId && s.status === 'COMPLETED'
            )
            if (found) {
              markSuccess(found)
              return
            }
          } catch {
            // 500 — continue
          }
        }

        // Timed out — generation was confirmed started, so fetch latest and show success
        if (pollCountRef.current >= MAX_BACKGROUND_POLLS) {
          // Last attempt: fetch all marking schemes to get the latest content
          if (paper) {
            try {
              const res = await httpClient.get<{
                success: boolean
                data: { markingSchemes: MarkingSchemeContent[] }
              }>('/marking-schemes')

              const paperId =
                typeof paper.id === 'string' ? parseInt(paper.id, 10) : paper.id
              const found = (res.data?.data?.markingSchemes ?? []).find(
                (s) => s.examPaperId === paperId && s.status === 'COMPLETED'
              )
              if (found) {
                markSuccess(found)
              } else {
                markSuccess()
              }
            } catch {
              markSuccess()
            }
          } else {
            markSuccess()
          }
          return
        }

        if (activeRef.current) {
          pollTimerRef.current = setTimeout(poll, POLL_INTERVAL_MS)
        }
      }

      pollTimerRef.current = setTimeout(poll, 3000)
    },
    [paper, markSuccess, stopPolling]
  )

  // ─── Trigger generation ───────────────────────────────────────────────────

  const handleGenerate = async () => {
    if (!paper) return
    setError(null)
    setModalState('starting')

    try {
      const paperIdNum =
        typeof paper.id === 'string' ? parseInt(paper.id, 10) : paper.id

      const res = await httpClient.post<{
        success: boolean
        data: {
          sessionId: string
          examPaperId: number
          status: string
          message: string
          generatedMarkingScheme: MarkingSchemeContent | null
        }
      }>('/marking-schemes/generate', { examPaperId: paperIdNum })

      const result = res.data.data

      if (result.status === 'COMPLETED' && result.generatedMarkingScheme) {
        markSuccess(result.generatedMarkingScheme)
      } else {
        setModalState('waiting')
        startBackgroundPolling(result.sessionId)
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to start generation'
      setError(msg)
      setModalState('error')
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  if (!isOpen || !paper) return null

  const canClose = modalState !== 'starting'

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && canClose) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-dark-card w-full max-w-md rounded-2xl overflow-hidden border border-dark-lighter shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-lighter">
          <h2 className="text-xl font-bold text-white">Generate Marking Scheme</h2>
          <button
            onClick={onClose}
            disabled={!canClose}
            className="p-1.5 rounded-lg hover:bg-dark-lighter transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-text-gray" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Paper info */}
          <div className="space-y-1">
            <p className="text-sm text-text-gray">Exam Paper</p>
            <p className="text-lg font-semibold text-white">{paper.courseCode}</p>
            <p className="text-sm text-text-gray">{paper.courseName}</p>
            <div className="flex gap-3 text-xs text-text-gray pt-1">
              <span>{paper.year}</span>
              <span>•</span>
              <span>{paper.semester === 'first' ? 'Semester 1' : 'Semester 2'}</span>
              <span>•</span>
              <span className="capitalize">{paper.examType}</span>
            </div>
          </div>

          {/* Starting / Waiting */}
          {(modalState === 'starting' || modalState === 'waiting') && (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Loader className="w-5 h-5 text-primary animate-spin flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">
                    {modalState === 'starting'
                      ? 'Starting generation...'
                      : 'Generating marking scheme...'}
                  </p>
                  <p className="text-xs text-text-gray mt-1">
                    Our AI is analysing the paper. This usually takes 30–90 seconds.
                  </p>
                </div>
              </div>
              <div className="w-full h-1.5 bg-dark rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full animate-pulse"
                  style={{ width: '75%' }}
                />
              </div>
              <p className="text-xs text-center text-text-gray">
                Please keep this window open…
              </p>
            </div>
          )}

          {/* Success */}
          {modalState === 'success' && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Marking Scheme Ready!</p>
                  <p className="text-xs text-text-gray mt-1">
                    Saved to{' '}
                    {paper ? (
                      <Link
                        href={`/marking-schemes?paperId=${paper.id}`}
                        onClick={onClose}
                        className="text-primary hover:text-primary/80 transition-colors font-semibold underline"
                      >
                        My Marking Schemes
                      </Link>
                    ) : (
                      <strong className="text-white">My Marking Schemes</strong>
                    )}
                    . Continue in the chatbot or view it later.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {modalState === 'error' && error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-white">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-dark-lighter px-6 py-4">
          {modalState === 'idle' && (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg border border-dark-lighter text-text-gray hover:bg-dark-lighter transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-dark font-semibold hover:bg-primary/90 transition-colors text-sm"
              >
                Generate
              </button>
            </div>
          )}

          {modalState === 'starting' && (
            <div className="flex justify-center py-1">
              <span className="text-xs text-text-gray">Please wait…</span>
            </div>
          )}

          {modalState === 'waiting' && (
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 rounded-lg border border-dark-lighter text-text-gray hover:bg-dark-lighter transition-colors text-sm font-medium"
            >
              Run in Background
            </button>
          )}

          {modalState === 'success' && (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg border border-dark-lighter text-text-gray hover:bg-dark-lighter transition-colors text-sm font-medium"
              >
                Close
              </button>
              {paper && (
                <Link
                  href={`/chatbot?paper=${paper.id}&code=${encodeURIComponent(paper.courseCode)}&title=${encodeURIComponent(paper.courseName)}`}
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-dark font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  View in Chatbot
                </Link>
              )}
            </div>
          )}

          {modalState === 'error' && (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg border border-dark-lighter text-text-gray hover:bg-dark-lighter transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setModalState('idle')
                  setError(null)
                }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-dark font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}