'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Upload, FileText, Award, Maximize2, Minimize2, Loader2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import { PastPaper } from '@/types'
import { Document, Page, pdfjs } from 'react-pdf'
import { useScreenshotProtection } from '@/features/past-papers/hooks/useScreenshotProtection'
import { injectProtectionStyles } from '@/features/past-papers/utils/screenshotProtection'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

interface PreviewModalProps {
  paper: PastPaper | null
  isOpen: boolean
  onClose: () => void
  onUploadToAI: (paper: PastPaper) => void
  onGenerateMarkingScheme: (paper: PastPaper) => void
}

async function fetchPdfAsBlob(url: string): Promise<string> {
  try {
    const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(url)}`
    const res = await fetch(proxyUrl)
    if (res.ok) {
      const blob = await res.blob()
      return URL.createObjectURL(blob)
    }
  } catch {
    // fall through
  }
  try {
    const res = await fetch(url, { mode: 'cors' })
    if (res.ok) {
      const blob = await res.blob()
      return URL.createObjectURL(blob)
    }
  } catch {
    // CORS blocked
  }
  return url
}

export default function PreviewModal({ paper, isOpen, onClose, onUploadToAI, onGenerateMarkingScheme }: PreviewModalProps) {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageWidth, setPageWidth] = useState(0)
  const [pdfSource, setPdfSource] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const blobUrlRef = useRef<string | null>(null)

  // Enable screenshot protection
  useScreenshotProtection(containerRef)

  // Inject protection styles once
  useEffect(() => {
    injectProtectionStyles()
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Width measurement for mobile react-pdf only
  useEffect(() => {
    if (!isOpen || !isMobile) return
    const update = () => {
      if (containerRef.current) {
        setPageWidth(containerRef.current.clientWidth)
      }
    }
    update()
    const t1 = setTimeout(update, 100)
    const t2 = setTimeout(update, 400)
    window.addEventListener('resize', update)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener('resize', update)
    }
  }, [isOpen, isFullScreen, isMobile])

  // Fetch PDF blob for mobile only
  useEffect(() => {
    if (!isOpen || !paper) return
    setIsLoading(true)
    setLoadError(null)
    setCurrentPage(1)
    setNumPages(null)
    setPdfSource(null)

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }

    if (!isMobile) return

    const rawUrl = paper.previewUrl || paper.fileUrl
    if (!rawUrl) {
      setLoadError('No URL available for this paper.')
      setIsLoading(false)
      return
    }

    fetchPdfAsBlob(rawUrl).then((src) => {
      if (src.startsWith('blob:')) blobUrlRef.current = src
      setPdfSource(src)
    }).catch(() => {
      setLoadError('Failed to fetch the PDF.')
      setIsLoading(false)
    })
  }, [isOpen, paper, isMobile])

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
    }
  }, [])

  if (!isOpen || !paper) return null

  const rawUrl = paper.previewUrl || paper.fileUrl
  const preventContextMenu = (e: React.MouseEvent | React.TouchEvent) => e.preventDefault()

  const handleRetry = () => {
    setLoadError(null)
    setIsLoading(true)
    setPdfSource(null)
    const url = paper.previewUrl || paper.fileUrl
    fetchPdfAsBlob(url).then((src) => {
      if (src.startsWith('blob:')) blobUrlRef.current = src
      setPdfSource(src)
    }).catch(() => {
      setLoadError('Still unable to load. Please try Ask AI instead.')
      setIsLoading(false)
    })
  }

  return (
    <div
      className={`preview-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm transition-all duration-300 ${isFullScreen ? 'p-0' : 'p-4'}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onContextMenu={preventContextMenu}
    >
      <div ref={containerRef} className={`preview-modal protected-content relative bg-dark-card flex flex-col overflow-hidden border border-dark-lighter shadow-2xl transition-all duration-300 ${isFullScreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[90vh] rounded-2xl'}`}>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-lighter flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-lg bg-dark-lighter flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-semibold truncate">{paper.courseCode} - {paper.courseName}</h2>
              <p className="text-text-gray text-sm">
                {paper.year} • {paper.semester === 'first' ? 'Semester 1' : 'Semester 2'} • {paper.examType.toUpperCase()} Exam
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onGenerateMarkingScheme(paper)} className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg font-medium text-sm hover:bg-primary/30 transition-colors">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Generate Marking Scheme</span>
            </button>
            {/* <button onClick={() => onUploadToAI(paper)} className="flex items-center gap-2 px-4 py-2 bg-secondary/20 text-secondary rounded-lg font-medium text-sm hover:bg-secondary/30 transition-colors">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button> */}
            <div className="w-px h-6 bg-dark-lighter mx-1" />
            <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-2 text-text-gray hover:text-white rounded-lg">
              {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button onClick={onClose} className="p-2 text-text-gray hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ===== DESKTOP ===== */}
        {!isMobile && (
          <div className="flex-1 bg-dark relative group overflow-y-auto" onContextMenu={preventContextMenu}>
            {paper.previewUrl || paper.fileUrl ? (
              <>
                {isLoading && (
                  <div className="absolute inset-0 w-full h-full bg-dark z-20 flex items-start justify-center pt-[40vh]">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                      <p className="text-text-gray animate-pulse">Loading preview...</p>
                    </div>
                  </div>
                )}
                
                <div className="relative w-full h-[350vh]">
                  <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    onContextMenu={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  />
                  <iframe
                    src={`${paper.previewUrl || paper.fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-full border-none print:hidden"
                    title={`${paper.courseCode} - ${paper.courseName}`}
                    onLoad={() => setIsLoading(false)}
                  />
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-text-gray gap-4">
                <FileText className="w-16 h-16 opacity-20" />
                <p>Preview not available</p>
              </div>
            )}
          </div>
        )}

        {/* ===== MOBILE ===== */}
        {isMobile && (
          <>
            <div
              ref={containerRef}
              className="flex-1 overflow-y-auto relative"
              style={{ backgroundColor: '#ffffff', WebkitTouchCallout: 'none', userSelect: 'none' } as React.CSSProperties}
              onContextMenu={preventContextMenu}
            >
              {!rawUrl ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                  <FileText className="w-16 h-16 opacity-20" />
                  <p>Preview not available</p>
                </div>
              ) : (
                <div className="flex flex-col items-center w-full">
                  {(isLoading || !pdfSource) && !loadError && (
                    <div className="flex flex-col items-center gap-3 py-20">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                      <p className="text-gray-500 text-sm animate-pulse">
                        {!pdfSource ? 'Fetching paper...' : 'Rendering...'}
                      </p>
                    </div>
                  )}
                  {loadError && (
                    <div className="flex flex-col items-center gap-4 py-20 px-6 text-center">
                      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                      </div>
                      <div>
                        <p className="text-gray-800 font-semibold mb-1">Could not load preview</p>
                        <p className="text-gray-500 text-sm">{loadError}</p>
                      </div>
                      <div className="flex flex-col gap-2 w-full max-w-xs">
                        <button onClick={handleRetry} className="px-4 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm">
                          Retry
                        </button>
                        <button
                          onClick={() => { onUploadToAI(paper); onClose() }}
                          className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm"
                        >
                          Ask AI instead
                        </button>
                      </div>
                    </div>
                  )}
                  {pdfSource && !loadError && (
                    <Document
                      file={pdfSource}
                      onLoadSuccess={({ numPages }) => {
                        setNumPages(numPages)
                        setIsLoading(false)
                      }}
                      onLoadError={(err) => {
                        console.error('[PreviewModal] PDF load error:', err)
                        setIsLoading(false)
                        setLoadError('This paper could not be rendered on your device.')
                      }}
                      loading={null}
                      error={null}
                    >
                      {!isLoading && pageWidth > 0 && (
                        <Page
                          pageNumber={currentPage}
                          width={pageWidth}
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                          canvasBackground="#ffffff"
                          onRenderError={(err) => {
                            console.error('[PreviewModal] render error:', err)
                            setLoadError('Failed to render this page.')
                          }}
                        />
                      )}
                    </Document>
                  )}
                </div>
              )}
            </div>

            {!isLoading && !loadError && numPages && numPages > 1 && (
              <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 py-3 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-gray-100 text-gray-800 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>
                <span className="text-gray-500 text-sm font-medium">
                  {currentPage} / {numPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
                  disabled={currentPage >= numPages}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-gray-100 text-gray-800 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}