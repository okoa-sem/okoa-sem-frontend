'use client'

import { useState, useEffect } from 'react'
import { Plus, MessageCircle } from 'lucide-react'
import { ChatHistorySection } from '@/types'

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
  chatHistory: ChatHistorySection[]
  activeChatId: string | null
  onSelectChat: (chatId: string) => void
  onNewChat: () => void
}

export default function ChatSidebar({
  isOpen,
  onClose,
  chatHistory,
  activeChatId,
  onSelectChat,
  onNewChat,
}: ChatSidebarProps) {
  const [isLight, setIsLight] = useState(false)

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

  const getSidebarStyle = (): React.CSSProperties => ({
    backgroundColor: isLight ? '#FFFFFF' : '#0F0F0F',
    borderRightColor: isLight ? '#E5E7EB' : '#2A2A2A',
  })

  const getBorderStyle = (): React.CSSProperties => ({
    borderColor: isLight ? '#E5E7EB' : '#2A2A2A',
  })

  const getSectionLabelStyle = (): React.CSSProperties => ({
    color: isLight ? '#6B7280' : '#A0A0A0',
  })

  const getChatItemStyle = (isActive: boolean): React.CSSProperties => ({
    backgroundColor: isActive 
      ? (isLight ? '#F3F4F6' : '#1A1A1A')
      : 'transparent',
    borderLeft: isActive ? '3px solid #00D666' : '3px solid transparent',
  })

  const getChatTitleStyle = (): React.CSSProperties => ({
    color: isLight ? '#1F2937' : '#FFFFFF',
  })

  const getChatTimeStyle = (): React.CSSProperties => ({
    color: isLight ? '#9CA3AF' : '#A0A0A0',
  })

  const getIconStyle = (): React.CSSProperties => ({
    color: isLight ? '#9CA3AF' : '#A0A0A0',
  })

  const getEmptyStateStyle = (): React.CSSProperties => ({
    color: isLight ? '#6B7280' : '#A0A0A0',
  })

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 h-full w-[280px] border-r flex flex-col z-50 lg:z-auto transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={getSidebarStyle()}
      >
        {/* Sidebar Header - Visible on mobile when sidebar is open */}
        <div 
          className="lg:hidden p-4 border-b flex items-center justify-between"
          style={getBorderStyle()}
        >
          <span className={`font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>
            Chat History
          </span>
        </div>

        {/* New Chat Button */}
        <div 
          className="p-4 border-b"
          style={getBorderStyle()}
        >
          <button
            onClick={() => {
              onNewChat()
              onClose()
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-base transition-colors bg-primary text-white hover:bg-primary-dark"
          >
            <Plus className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div 
          className="flex-1 overflow-y-auto p-4"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: isLight ? '#D1D5DB transparent' : '#2A2A2A transparent',
          }}
        >
          {chatHistory.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <div 
                className="text-xs font-semibold uppercase tracking-wider mb-2 px-3"
                style={getSectionLabelStyle()}
              >
                {section.label}
              </div>
              {section.items.map((item) => {
                const isActive = activeChatId === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectChat(item.id)
                      onClose()
                    }}
                    className="w-full flex items-center gap-3 py-3 px-4 rounded-lg mb-1 transition-all text-left hover:opacity-80"
                    style={getChatItemStyle(isActive)}
                  >
                    <MessageCircle 
                      className="w-4 h-4 flex-shrink-0" 
                      style={getIconStyle()}
                    />
                    <span 
                      className="flex-1 text-[15px] truncate"
                      style={getChatTitleStyle()}
                    >
                      {item.title}
                    </span>
                    <span 
                      className="text-xs flex-shrink-0"
                      style={getChatTimeStyle()}
                    >
                      {item.time}
                    </span>
                  </button>
                )
              })}
            </div>
          ))}

          {chatHistory.length === 0 && (
            <div 
              className="text-center py-8"
              style={getEmptyStateStyle()}
            >
              <MessageCircle 
                className="w-10 h-10 mx-auto mb-3 opacity-50" 
                style={getIconStyle()}
              />
              <p className="text-sm">No chat history yet</p>
              <p className="text-xs mt-1 opacity-70">Start a new conversation!</p>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}