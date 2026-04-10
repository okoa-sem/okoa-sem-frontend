'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export default function ChatInput({ onSend, disabled = false, placeholder = 'Ask me anything...' }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isLight, setIsLight] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }, [message])

  const handleSend = () => {
    const trimmedMessage = message.trim()
    if (trimmedMessage && !disabled) {
      onSend(trimmedMessage)
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isDisabled = disabled || !message.trim()

  const getContainerStyle = (): React.CSSProperties => ({
    backgroundColor: isLight ? '#F9FAFB' : '#0F0F12',
    borderTop: isLight ? '1px solid #E5E7EB' : '1px solid #2A2A2A',
  })

  const getTextareaStyle = (): React.CSSProperties => ({
    backgroundColor: isLight ? '#FFFFFF' : '#1A1A1A',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: isFocused ? '#00D666' : (isLight ? '#E5E7EB' : '#2A2A2A'),
    color: isLight ? '#1F2937' : '#FFFFFF',
    caretColor: '#00D666',
    boxShadow: isFocused ? `0 0 0 3px ${isLight ? 'rgba(0, 214, 102, 0.15)' : 'rgba(0, 214, 102, 0.1)'}` : 'none',
  })

  const getButtonStyle = (): React.CSSProperties => ({
    backgroundColor: isDisabled 
      ? (isLight ? '#E5E7EB' : '#2A2A2A')
      : '#00D666',
    color: isDisabled
      ? (isLight ? '#9CA3AF' : '#6B7280')
      : isLight ? '#000000' : '#FFFFFF',
    fontWeight: 600,
  })

  return (
    <div 
      className="px-3 sm:px-4 py-4 md:px-6 md:py-6 lg:p-8 sticky bottom-0 z-50 w-full"
      style={getContainerStyle()}
    >
      <div className="max-w-[900px] mx-auto flex gap-3 md:gap-4 items-end lg:px-0">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={`
            flex-1 rounded-3xl px-4 md:px-6 py-3 md:py-4 text-base outline-none resize-none 
            max-h-[150px] min-h-[52px] transition-all disabled:opacity-50 font-[inherit] scrollbar-hide
            ${isLight ? 'placeholder:text-gray-400' : 'placeholder:text-gray-500'}
          `}
          style={getTextareaStyle()}
        />
        <button
          onClick={handleSend}
          disabled={isDisabled}
          className="w-[52px] h-[52px] flex items-center justify-center rounded-full transition-all flex-shrink-0 hover:scale-105 disabled:cursor-not-allowed"
          style={getButtonStyle()}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}