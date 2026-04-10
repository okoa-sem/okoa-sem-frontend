'use client'

import { useState } from 'react'
import { Copy, Check, FileText, Download } from 'lucide-react'

interface MessageActionsProps {
  message: string
  messageId: string
  onExport?: (content: string) => void
  isLight: boolean
}

export default function MessageActions({ message, messageId, onExport, isLight }: MessageActionsProps) {
  const [copied, setCopied] = useState(false)
  const [exported, setExported] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExport = () => {
    if (onExport) {
      onExport(message)
      setExported(true)
      setTimeout(() => setExported(false), 2000)
    }
  }

  return (
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={handleCopy}
        className="p-2 rounded-lg transition-all hover:scale-110"
        style={{
          backgroundColor: isLight ? '#F3F4F6' : '#2A2A2A',
          color: isLight ? '#6B7280' : '#A0A0A0',
        }}
        title="Copy message"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>

      <button
        onClick={handleExport}
        className="p-2 rounded-lg transition-all hover:scale-110"
        style={{
          backgroundColor: isLight ? '#F3F4F6' : '#2A2A2A',
          color: isLight ? '#6B7280' : '#A0A0A0',
        }}
        title="Export to document"
      >
        {exported ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Download className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}
