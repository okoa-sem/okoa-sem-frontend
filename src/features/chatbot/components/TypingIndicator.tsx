'use client'

import { useState, useEffect } from 'react'
import { Bot } from 'lucide-react'

interface TypingIndicatorProps {
  isVisible: boolean
}

export default function TypingIndicator({ isVisible }: TypingIndicatorProps) {
  const [isLight, setIsLight] = useState(false)

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

  if (!isVisible) return null

  // Theme-aware styles
  const getAvatarStyle = (): React.CSSProperties => ({
    backgroundColor: '#00D666',
    color: isLight ? '#FFFFFF' : '#1A1A1A',
  })

  const getBubbleStyle = (): React.CSSProperties => ({
    backgroundColor: isLight ? '#F3F4F6' : '#2A2A2A',
    border: isLight ? '1px solid #E5E7EB' : 'none',
  })

  const getDotStyle = (): React.CSSProperties => ({
    backgroundColor: isLight ? '#6B7280' : '#A0A0A0',
  })

  return (
    <div className="flex gap-4 mb-8 justify-start animate-slideIn">
      {/* Bot Avatar */}
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={getAvatarStyle()}
      >
        <Bot className="w-5 h-5" />
      </div>

      {/* Typing Bubble */}
      <div
        className="px-5 py-4 rounded-[4px_18px_18px_18px]"
        style={getBubbleStyle()}
      >
        <div className="flex gap-1.5 items-center h-5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full animate-typing"
              style={{
                ...getDotStyle(),
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}