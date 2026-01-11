'use client'

import { MarkingScheme } from '@/types'
import { X, Copy, Share2 } from 'lucide-react'
import { useState } from 'react'

interface MarkingSchemeDetailProps {
  scheme: MarkingScheme | null
  isOpen: boolean
  onClose: () => void
}

export default function MarkingSchemeDetail({ 
  scheme, 
  isOpen, 
  onClose 
}: MarkingSchemeDetailProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen || !scheme) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scheme.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-dark-card w-full max-w-4xl h-[90vh] rounded-2xl overflow-hidden border border-dark-lighter shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-lighter flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">
              {scheme.paper?.courseCode} - {scheme.paper?.courseName}
            </h2>
            <p className="text-text-gray text-sm mt-1">
              Generated on {new Date(scheme.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-dark-lighter text-white rounded-lg font-medium text-sm hover:bg-dark-lighter/80 transition-colors"
              title={copied ? "Copied!" : "Copy to clipboard"}
            >
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-text-gray hover:text-white hover:bg-dark-lighter rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="bg-dark rounded-lg p-6 text-white prose prose-invert max-w-none">
              {/* Parse and display markdown content */}
              {scheme.content.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return (
                    <h1 key={index} className="text-2xl font-bold text-white mt-4 mb-2">
                      {line.replace(/^# /, '')}
                    </h1>
                  )
                }
                if (line.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-xl font-semibold text-primary mt-3 mb-2">
                      {line.replace(/^## /, '')}
                    </h2>
                  )
                }
                if (line.startsWith('**') && line.endsWith('**')) {
                  return (
                    <p key={index} className="font-semibold text-white my-2">
                      {line.replace(/\*\*/g, '')}
                    </p>
                  )
                }
                if (line.startsWith('- ')) {
                  return (
                    <li key={index} className="ml-4 text-text-gray my-1">
                      {line.replace(/^- /, '')}
                    </li>
                  )
                }
                if (line.startsWith('1. ')) {
                  return (
                    <li key={index} className="ml-4 text-text-gray my-1 list-decimal">
                      {line.replace(/^1\. /, '')}
                    </li>
                  )
                }
                if (line.trim() === '') {
                  return <div key={index} className="h-2" />
                }
                return (
                  <p key={index} className="text-text-gray my-1">
                    {line}
                  </p>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-dark-lighter flex-shrink-0 bg-dark">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-primary text-dark rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
