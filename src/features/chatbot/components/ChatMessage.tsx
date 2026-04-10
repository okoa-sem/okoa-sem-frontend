'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, Bot, User, Download, Share2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChatMessage as ChatMessageType } from '@/types'
import ExportDialog from './ExportDialog'
import ShareDialog from './ShareDialog'

interface ChatMessageProps {
  message: ChatMessageType
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [isLight, setIsLight] = useState(false)
  const [copied, setCopied] = useState(false)
  const [hoverActions, setHoverActions] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const isBot = message.role === 'assistant'

  // Detect theme from body class
  useEffect(() => {
    const checkTheme = () => {
      setIsLight(document.body.classList.contains('light-theme'))
    }
    
    checkTheme()
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkTheme()
        }
      })
    })
    
    observer.observe(document.body, { attributes: true })
    
    return () => observer.disconnect()
  }, [])

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExport = () => {
    setShowExportDialog(true)
  }

  // Theme-aware styles
  const getBotAvatarStyle = (): React.CSSProperties => ({
    backgroundColor: '#00D666',
    color: isLight ? '#FFFFFF' : '#1A1A1A',
  })

  const getUserAvatarStyle = (): React.CSSProperties => ({
    background: isLight 
      ? 'linear-gradient(135deg, #6B7280, #4B5563)' 
      : 'linear-gradient(135deg, #6B7280, #4B5563)',
    color: '#FFFFFF',
  })

  const getBotMessageStyle = (): React.CSSProperties => ({
    backgroundColor: isLight ? '#F9FAFB' : '#2A2A2A',
    borderRadius: '4px 18px 18px 18px',
    border: isLight ? '1px solid #E5E7EB' : 'none',
  })

  const getUserMessageStyle = (): React.CSSProperties => ({
    backgroundColor: isLight ? '#00D666' : '#3A4A3A',
    borderRadius: '18px 18px 4px 18px',
  })

  const getMessageTextStyle = (): React.CSSProperties => ({
    color: isBot 
      ? (isLight ? '#1F2937' : '#FFFFFF')
      : '#FFFFFF',
  })

  const getTimestampStyle = (): React.CSSProperties => ({
    color: isBot
      ? (isLight ? '#6B7280' : '#A0A0A0')
      : 'rgba(255, 255, 255, 0.7)',
  })

  // Custom markdown components for better styling
  const markdownComponents = {
    h1: ({ node, ...props }: any) => (
      <h1 className="text-2xl font-bold mt-6 mb-4" style={{ color: getMessageTextStyle().color }} {...props} />
    ),
    h2: ({ node, ...props }: any) => (
      <h2 className="text-xl font-bold mt-5 mb-3" style={{ color: getMessageTextStyle().color }} {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 className="text-lg font-bold mt-4 mb-2" style={{ color: getMessageTextStyle().color }} {...props} />
    ),
    p: ({ node, ...props }: any) => (
      <p className="mb-3 leading-relaxed" style={{ color: getMessageTextStyle().color }} {...props} />
    ),
    ul: ({ node, ...props }: any) => (
      <ul className="list-disc list-inside mb-3 space-y-1" {...props} />
    ),
    ol: ({ node, ...props }: any) => (
      <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />
    ),
    li: ({ node, ...props }: any) => (
      <li className="ml-2" style={{ color: getMessageTextStyle().color }} {...props} />
    ),
    code: ({ node, inline, ...props }: any) => {
      if (inline) {
        return (
          <code
            className="px-2 py-1 rounded text-sm font-mono"
            style={{
              backgroundColor: isLight ? '#F3F4F6' : '#1A1A1A',
              color: isLight ? '#DC2626' : '#FF7B7B',
            }}
            {...props}
          />
        )
      }
      return <code {...props} />
    },
    pre: ({ node, ...props }: any) => (
      <pre
        className="rounded-lg p-4 overflow-x-auto mb-3 text-sm"
        style={{
          backgroundColor: isLight ? '#F3F4F6' : '#1A1A1A',
          border: `1px solid ${isLight ? '#E5E7EB' : '#3A3A3A'}`,
        }}
        {...props}
      />
    ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote
        className="border-l-4 pl-4 py-2 mb-3 italic"
        style={{
          borderColor: '#00D666',
          color: getMessageTextStyle().color,
        }}
        {...props}
      />
    ),
    table: ({ node, ...props }: any) => (
      <div className="overflow-x-auto mb-3">
        <table
          className="border-collapse border"
          style={{
            borderColor: isLight ? '#E5E7EB' : '#3A3A3A',
          }}
          {...props}
        />
      </div>
    ),
    th: ({ node, ...props }: any) => (
      <th
        className="border p-2 font-semibold"
        style={{
          borderColor: isLight ? '#E5E7EB' : '#3A3A3A',
          backgroundColor: isLight ? '#F3F4F6' : '#3A3A3A',
          color: getMessageTextStyle().color,
        }}
        {...props}
      />
    ),
    td: ({ node, ...props }: any) => (
      <td
        className="border p-2"
        style={{
          borderColor: isLight ? '#E5E7EB' : '#3A3A3A',
          color: getMessageTextStyle().color,
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
      className={`flex gap-3 md:gap-4 mb-8 animate-slideIn ${
        isBot ? 'justify-start' : 'justify-end'
      }`}
      onMouseEnter={() => setHoverActions(true)}
      onMouseLeave={() => setHoverActions(false)}
    >
      {/* Bot Avatar - Only show for bot messages */}
      {isBot && (
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
          style={getBotAvatarStyle()}
        >
          <Bot className="w-5 h-5" />
        </div>
      )}

      {/* Message Content Container */}
      <div className="flex flex-col gap-2 max-w-[900px] min-w-0">
        {/* Main Message */}
        <div
          className="p-5 rounded-2xl"
          style={isBot ? getBotMessageStyle() : getUserMessageStyle()}
        >
          <div 
            className="text-base leading-relaxed"
            style={getMessageTextStyle()}
          >
            {isBot ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>
            )}
          </div>
        </div>

        {/* Actions Row */}
        <div 
          className="flex items-center gap-2 px-3 sm:px-4 md:px-5 transition-all flex-wrap"
        >
          <span 
            className="text-xs font-medium"
            style={getTimestampStyle()}
          >
            {formatTime(message.timestamp)}
          </span>

          {isBot && (
            <>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                style={{
                  backgroundColor: isLight ? '#F3F4F6' : '#3A3A3A',
                  color: isLight ? '#6B7280' : '#A0A0A0',
                }}
                title="Copy message"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={() => setShowShareDialog(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                style={{
                  backgroundColor: isLight ? '#F3F4F6' : '#3A3A3A',
                  color: isLight ? '#6B7280' : '#A0A0A0',
                }}
                title="Share response"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-xs">Share</span>
              </button>

              <button
                onClick={handleExport}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                style={{
                  backgroundColor: isLight ? '#F3F4F6' : '#3A3A3A',
                  color: isLight ? '#6B7280' : '#A0A0A0',
                }}
                title="Download response"
              >
                <Download className="w-4 h-4" />
                <span className="text-xs">Download</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* User Avatar - Only show for user messages */}
      {!isBot && (
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
          style={getUserAvatarStyle()}
        >
          <User className="w-5 h-5" />
        </div>
      )}

      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        content={message.content}
        isLight={isLight}
      />

      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        content={message.content}
        isLight={isLight}
      />
    </div>
  )
}