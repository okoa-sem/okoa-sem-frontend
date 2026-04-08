'use client'

import { useState } from 'react'
import { X, FileText, Download } from 'lucide-react'
import { exportToText, exportToMarkdown, exportChatToJSON } from '@/features/chatbot/utils/exportUtils'

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  content: string
  isLight: boolean
}

export default function ExportDialog({ isOpen, onClose, content, isLight }: ExportDialogProps) {
  const [exporting, setExporting] = useState(false)

  if (!isOpen) return null

  const handleExport = (format: 'txt' | 'md' | 'json') => {
    setExporting(true)
    const timestamp = new Date().toISOString().split('T')[0]
    
    try {
      if (format === 'txt') {
        exportToText(content, `study-response-${timestamp}.txt`)
      } else if (format === 'md') {
        exportToMarkdown(content, `study-response-${timestamp}.md`)
      } else if (format === 'json') {
        exportChatToJSON([{ content, timestamp: new Date() }], `study-response-${timestamp}.json`)
      }
    } finally {
      setExporting(false)
      setTimeout(onClose, 500)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl shadow-xl z-50 p-6"
        style={{
          backgroundColor: isLight ? '#FFFFFF' : '#1A1A1A',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" style={{ color: '#00D666' }} />
            <h2 className="text-lg font-semibold" style={{ color: isLight ? '#1F2937' : '#FFFFFF' }}>
              Download Response
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition"
            style={{
              color: isLight ? '#6B7280' : '#A0A0A0',
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <p className="mb-6" style={{ color: isLight ? '#6B7280' : '#A0A0A0' }}>
          Choose a format to download your response:
        </p>

        {/* Export Options */}
        <div className="space-y-3">
          <button
            onClick={() => handleExport('txt')}
            disabled={exporting}
            className="w-full flex items-center gap-3 p-4 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
            style={{
              backgroundColor: isLight ? '#F3F4F6' : '#2A2A2A',
              color: isLight ? '#1F2937' : '#FFFFFF',
            }}
          >
            <Download className="w-5 h-5 text-green-500" />
            <div className="text-left">
              <div className="font-medium">Text File (.txt)</div>
              <div className="text-xs" style={{ color: isLight ? '#6B7280' : '#A0A0A0' }}>
                Plain text format
              </div>
            </div>
          </button>

          <button
            onClick={() => handleExport('md')}
            disabled={exporting}
            className="w-full flex items-center gap-3 p-4 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
            style={{
              backgroundColor: isLight ? '#F3F4F6' : '#2A2A2A',
              color: isLight ? '#1F2937' : '#FFFFFF',
            }}
          >
            <Download className="w-5 h-5 text-blue-500" />
            <div className="text-left">
              <div className="font-medium">Markdown (.md)</div>
              <div className="text-xs" style={{ color: isLight ? '#6B7280' : '#A0A0A0' }}>
                Formatted with markdown
              </div>
            </div>
          </button>

          <button
            onClick={() => handleExport('json')}
            disabled={exporting}
            className="w-full flex items-center gap-3 p-4 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
            style={{
              backgroundColor: isLight ? '#F3F4F6' : '#2A2A2A',
              color: isLight ? '#1F2937' : '#FFFFFF',
            }}
          >
            <Download className="w-5 h-5 text-purple-500" />
            <div className="text-left">
              <div className="font-medium">JSON (.json)</div>
              <div className="text-xs" style={{ color: isLight ? '#6B7280' : '#A0A0A0' }}>
                Structured format
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t" style={{ borderColor: isLight ? '#E5E7EB' : '#2A2A2A' }}>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-lg transition-all"
            style={{
              backgroundColor: isLight ? '#F3F4F6' : '#2A2A2A',
              color: isLight ? '#1F2937' : '#FFFFFF',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}
