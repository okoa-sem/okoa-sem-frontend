'use client'

import { Eye, Upload, FileText, Award } from 'lucide-react'
import { PastPaper } from '@/types'

interface PaperCardProps {
  paper: PastPaper
  onPreview: (paper: PastPaper) => void
  onUploadToAI: (paper: PastPaper) => void
  onGenerateMarkingScheme: (paper: PastPaper) => void
  index: number
}

export default function PaperCard({ paper, onPreview, onUploadToAI, onGenerateMarkingScheme, index }: PaperCardProps) {
  const getExamTypeBadgeColor = (examType: string) => {
    switch (examType) {
      case 'main':
        return 'bg-primary/20 text-primary'
      case 'supplementary':
        return 'bg-secondary/20 text-secondary'
      case 'cat':
        return 'bg-amber-500/20 text-amber-400'
      default:
        return 'bg-dark-lighter text-text-gray'
    }
  }

  const getSemesterLabel = (semester: string) => {
    return semester === 'first' ? 'Semester 1' : 'Semester 2'
  }

  return (
    <div 
      className="paper-list-item paper-card bg-dark-card border border-dark-lighter rounded-xl p-4 hover:border-primary/50"
      style={{ animationDelay: `${Math.min(index * 0.02, 0.2)}s` }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Paper Icon & Info */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-dark-lighter flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-base mb-1 truncate">
              {paper.courseCode} - {paper.courseName}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getExamTypeBadgeColor(paper.examType)}`}>
                {paper.examType === 'cat' ? 'CAT' : paper.examType.charAt(0).toUpperCase() + paper.examType.slice(1)}
              </span>
              <span className="text-text-gray">•</span>
              <span className="text-text-gray">{getSemesterLabel(paper.semester)}</span>
              <span className="text-text-gray">•</span>
              <span className="text-text-gray">{paper.fileSize}</span>
              <span className="text-text-gray hidden sm:inline">•</span>
              <span className="text-text-gray hidden sm:inline">{paper.downloads.toLocaleString()} downloads</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onPreview(paper)}
            className="flex items-center gap-2 px-4 py-2.5 bg-dark-lighter text-white rounded-lg font-medium text-sm hover:bg-dark-lighter/80 transition-colors"
            title="Preview"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Preview</span>
          </button>
          
          <button
            onClick={() => onGenerateMarkingScheme(paper)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary/20 text-primary rounded-lg font-medium text-sm hover:bg-primary/30 transition-colors"
            title="Generate AI-powered marking scheme"
          >
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">Generate Answers</span>
          </button>
          
          <button
            onClick={() => onUploadToAI(paper)}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary/20 text-secondary rounded-lg font-medium text-sm hover:bg-secondary/30 transition-colors"
            title="Upload to AI Chatbot"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden md:inline">Ask AI</span>
          </button>
        </div>
      </div>
    </div>
  )
}