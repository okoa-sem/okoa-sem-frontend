'use client'

import { useState, useEffect } from 'react'
import { X, Upload, ExternalLink, FileText, Award, Maximize2, Minimize2, Loader2 } from 'lucide-react'
import { PastPaper } from '@/types'

interface PreviewModalProps {
  paper: PastPaper | null
  isOpen: boolean
  onClose: () => void
  onUploadToAI: (paper: PastPaper) => void
  onGenerateMarkingScheme: (paper: PastPaper) => void
}

export default function PreviewModal({ paper, isOpen, onClose, onUploadToAI, onGenerateMarkingScheme }: PreviewModalProps) {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
    }
  }, [isOpen, paper])

  if (!isOpen || !paper) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const preventContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <div 
      className={`preview-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm transition-all duration-300 ${isFullScreen ? 'p-0' : 'p-4'}`}
      onClick={handleBackdropClick}
      onContextMenu={preventContextMenu}
    >
      <div 
        className={`preview-modal relative bg-dark-card flex flex-col overflow-hidden border border-dark-lighter shadow-2xl transition-all duration-300 ${
          isFullScreen 
            ? 'w-full h-full rounded-none' 
            : 'w-full max-w-6xl h-[90vh] rounded-2xl'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-lighter flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-lg bg-dark-lighter flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-semibold truncate">
                {paper.courseCode} - {paper.courseName}
              </h2>
              <p className="text-text-gray text-sm">
                {paper.year} • {paper.semester === 'first' ? 'Semester 1' : 'Semester 2'} • {paper.examType === 'cat' ? 'CAT' : paper.examType.charAt(0).toUpperCase() + paper.examType.slice(1)} Exam
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onGenerateMarkingScheme(paper)}
              className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg font-medium text-sm hover:bg-primary/30 transition-colors"
            >
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Generate Marking Scheme</span>
            </button>
            
            <button
              onClick={() => onUploadToAI(paper)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary/20 text-secondary rounded-lg font-medium text-sm hover:bg-secondary/30 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
            
            <div className="w-px h-6 bg-dark-lighter mx-1" />

            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 text-text-gray hover:text-white hover:bg-dark-lighter rounded-lg transition-colors"
              title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
            >
              {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-text-gray hover:text-white hover:bg-dark-lighter rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Preview Area */}
        <div 
          className="flex-1 bg-dark relative group overflow-y-auto"
          onContextMenu={preventContextMenu}
        >
          {paper.previewUrl || paper.fileUrl ? (
            <div className="relative w-full h-[350vh]">
              {isLoading && (
                <div className="absolute inset-0 w-full h-full bg-dark z-20 flex items-start justify-center pt-[40vh]">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-text-gray animate-pulse">Loading preview...</p>
                  </div>
                </div>
              )}
              
              {/* Transparent Overlay to block interaction */}
              <div 
                className="absolute inset-0 z-10" 
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
              {/* Fallback/Download overlay if iframe fails or for better UX */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0">
                  {/* Hidden fallback */}
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-text-gray gap-4">
              <FileText className="w-16 h-16 opacity-20" />
              <p>Preview not available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
