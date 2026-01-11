'use client'

import { useState, useEffect } from 'react'
import { Copy, Bot, User, Check } from 'lucide-react'
import { ChatMessage as ChatMessageType } from '@/types'

interface ChatMessageProps {
  message: ChatMessageType
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [isLight, setIsLight] = useState(false)
  const [copied, setCopied] = useState(false)
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
    backgroundColor: isLight ? '#F3F4F6' : '#2A2A2A',
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

  const getCopyButtonStyle = (): React.CSSProperties => ({
    color: isLight ? '#6B7280' : '#A0A0A0',
  })

  return (
    <div
      className={`flex gap-4 mb-8 animate-slideIn ${
        isBot ? 'justify-start' : 'justify-end'
      }`}
    >
      {/* Bot Avatar - Only show for bot messages */}
      {isBot && (
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={getBotAvatarStyle()}
        >
          <Bot className="w-5 h-5" />
        </div>
      )}

      {/* Message Content */}
      <div
        className="max-w-[600px] p-4 px-5"
        style={isBot ? getBotMessageStyle() : getUserMessageStyle()}
      >
        <div 
          className="text-[15px] leading-[1.6] whitespace-pre-wrap"
          style={getMessageTextStyle()}
        >
          {message.content}
        </div>
        <div 
          className="flex items-center gap-2 mt-2 text-xs"
          style={getTimestampStyle()}
        >
          <span>{formatTime(message.timestamp)}</span>
          {isBot && (
            <button
              onClick={copyToClipboard}
              className="transition-colors p-0.5 hover:opacity-70"
              style={getCopyButtonStyle()}
              title="Copy message"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* User Avatar - Only show for user messages */}
      {!isBot && (
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={getUserAvatarStyle()}
        >
          <User className="w-5 h-5" />
        </div>
      )}
    </div>
  )
}