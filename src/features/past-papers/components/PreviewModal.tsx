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
              className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg font-medium text-sm hover:bg-amber-500/30 transition-colors"
            >
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Mark Scheme</span>
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
          {/* Placeholder for PDF preview - In production, use a PDF viewer library */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-24 h-24 rounded-2xl bg-dark-card mx-auto mb-6 flex items-center justify-center">
                <FileText className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {paper.courseCode}
              </h3>
              <p className="text-text-gray mb-6 max-w-md">
                {paper.courseName} - {paper.examType === 'cat' ? 'CAT' : paper.examType.charAt(0).toUpperCase() + paper.examType.slice(1)} Examination
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => onGenerateMarkingScheme(paper)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500/20 text-amber-400 rounded-xl font-semibold hover:bg-amber-500/30 transition-colors"
                >
                  <Award className="w-5 h-5" />
                  Generate Marking Scheme
                </button>
                
                <a
                  href={paper.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-dark-lighter text-white rounded-xl font-semibold hover:bg-dark-lighter/80 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  Open in New Tab
                </a>
              </div>
              
              <p className="text-text-gray text-sm mt-6">
                Downloaded {paper.downloads.toLocaleString()} times
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
