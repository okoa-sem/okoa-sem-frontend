'use client'

import { MarkingScheme } from '@/types'
import { X, Copy, Share2, Maximize2, Minimize2 } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
  const [isFullScreen, setIsFullScreen] = useState(false)

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

  // Custom markdown components for better styling (matching chatbot styling)
  const markdownComponents = {
    h1: ({ node, ...props }: any) => (
      <h1 className="text-2xl font-bold mt-6 mb-4 text-white" {...props} />
    ),
    h2: ({ node, ...props }: any) => (
      <h2 className="text-xl font-bold mt-5 mb-3 text-primary" {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 className="text-lg font-bold mt-4 mb-2 text-white" {...props} />
    ),
    p: ({ node, ...props }: any) => (
      <p className="mb-3 leading-relaxed text-text-gray" {...props} />
    ),
    ul: ({ node, ...props }: any) => (
      <ul className="list-disc list-inside mb-3 space-y-1 text-text-gray" {...props} />
    ),
    ol: ({ node, ...props }: any) => (
      <ol className="list-decimal list-inside mb-3 space-y-1 text-text-gray" {...props} />
    ),
    li: ({ node, ...props }: any) => (
      <li className="ml-2 text-text-gray" {...props} />
    ),
    code: ({ node, inline, ...props }: any) => {
      if (inline) {
        return (
          <code
            className="px-2 py-1 rounded text-sm font-mono bg-dark text-primary"
            {...props}
          />
        )
      }
      return <code {...props} />
    },
    pre: ({ node, ...props }: any) => (
      <pre
        className="rounded-lg p-4 overflow-x-auto mb-3 text-sm bg-dark border border-dark-lighter"
        {...props}
      />
    ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote
        className="border-l-4 pl-4 py-2 mb-3 italic border-primary text-text-gray"
        {...props}
      />
    ),
    table: ({ node, ...props }: any) => (
      <div className="overflow-x-auto mb-3">
        <table
          className="border-collapse border"
          style={{
            borderColor: '#3A3A3A',
          }}
          {...props}
        />
      </div>
    ),
    th: ({ node, ...props }: any) => (
      <th
        className="border p-2 font-semibold"
        style={{
          borderColor: '#3A3A3A',
          backgroundColor: '#2A2A2A',
          color: '#FFFFFF',
        }}
        {...props}
      />
    ),
    td: ({ node, ...props }: any) => (
      <td
        className="border p-2"
        style={{
          borderColor: '#3A3A3A',
          color: '#B0B0B0',
        }}
        {...props}
      />
    ),
    a: ({ node, ...props }: any) => (
      <a
        className="text-blue-500 hover:underline"
        {...props}
      />
    ),
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className={`bg-dark-card flex flex-col transition-all duration-300 ${
        isFullScreen 
          ? 'w-full h-full rounded-none' 
          : 'w-full max-w-4xl h-[90vh] rounded-2xl overflow-hidden border border-dark-lighter shadow-2xl m-4'
      }`}>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {!scheme.content ? (
              <div className="flex items-center justify-center h-full min-h-64">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full border-4 border-dark-lighter border-t-primary mx-auto mb-4 animate-spin" />
                  <p className="text-text-gray">Loading marking scheme...</p>
                </div>
              </div>
            ) : (
              <div className="bg-dark rounded-lg p-6 text-white prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {scheme.content}
                </ReactMarkdown>
              </div>
            )}
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
