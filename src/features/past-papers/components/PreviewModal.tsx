'use client'

import { X, Upload, ExternalLink, FileText, Award } from 'lucide-react'
import { PastPaper } from '@/types'

interface PreviewModalProps {
  paper: PastPaper | null
  isOpen: boolean
  onClose: () => void
  onUploadToAI: (paper: PastPaper) => void
  onGenerateMarkingScheme: (paper: PastPaper) => void
}

export default function PreviewModal({ paper, isOpen, onClose, onUploadToAI, onGenerateMarkingScheme }: PreviewModalProps) {
  if (!isOpen || !paper) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="preview-overlay fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="preview-modal relative bg-dark-card w-full max-w-5xl h-[85vh] rounded-2xl overflow-hidden border border-dark-lighter shadow-2xl flex flex-col">
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
            
            <button
              onClick={onClose}
              className="p-2 text-text-gray hover:text-white hover:bg-dark-lighter rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Preview Area */}
        <div className="flex-1 bg-dark overflow-hidden">
          {/* PDF Viewer would go here */}
          <div className="w-full h-full flex items-center justify-center text-text-gray">
             Preview not available
          </div>
        </div>
      </div>
    </div>
  )
}
