'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ChatMessage as ChatMessageType, ChatHistorySection, SubscriptionPlan, UserSubscription } from '@/types'
import { CHATBOT_CONFIG, STORAGE_KEYS } from '@/shared/constants'
import CompactHeader from '@/shared/components/CompactHeader'
import ChatSidebar from '@/features/chatbot/components/ChatSidebar'
import ChatMessage from '@/features/chatbot/components/ChatMessage'
import TypingIndicator from '@/features/chatbot/components/TypingIndicator'
import ChatInput from '@/features/chatbot/components/ChatInput'
import SubscriptionModal from '@/features/chatbot/components/SubscriptionModal'

const generateId = () => Math.random().toString(36).substr(2, 9)

const getTimeString = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const generateDemoChatHistory = (): ChatHistorySection[] => {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  return [
    {
      label: 'Today',
      items: [
        { id: 'chat-1', title: 'Help with calculus', time: '14:20', date: now },
      ],
    },
    {
      label: 'Yesterday',
      items: [
        { id: 'chat-2', title: 'Physics homework', time: '16:45', date: yesterday },
        { id: 'chat-3', title: 'Essay brainstorming', time: '10:30', date: yesterday },
      ],
    },
    {
      label: 'Last 7 Days',
      items: [
        { id: 'chat-4', title: 'Chemistry concepts', time: 'Mon', date: new Date() },
        { id: 'chat-5', title: 'Programming help', time: 'Sun', date: new Date() },
      ],
    },
  ]
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeChatId, setActiveChatId] = useState<string | null>('chat-1')
  const [chatHistory, setChatHistory] = useState<ChatHistorySection[]>([])
  const [subscription, setSubscription] = useState<UserSubscription>({ isActive: false })
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [hasCheckedSubscription, setHasCheckedSubscription] = useState(false)
  const [isLight, setIsLight] = useState(false)

  const chatContainerRef = useRef<HTMLDivElement>(null)

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
    const savedSubscription = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION)
    if (savedSubscription) {
      try {
        const parsed = JSON.parse(savedSubscription)
        if (parsed.expiresAt && new Date(parsed.expiresAt) > new Date()) {
          setSubscription({ ...parsed, isActive: true })
        } else {
          setSubscription({ isActive: false })
          setShowSubscriptionModal(true)
        }
      } catch {
        setSubscription({ isActive: false })
        setShowSubscriptionModal(true)
      }
    } else {
      setShowSubscriptionModal(true)
    }
    setHasCheckedSubscription(true)

    const savedHistory = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY)
    if (savedHistory) {
      try {
        setChatHistory(JSON.parse(savedHistory))
      } catch {
        setChatHistory(generateDemoChatHistory())
      }
    } else {
      setChatHistory(generateDemoChatHistory())
    }

    const welcomeMessage: ChatMessageType = {
      id: generateId(),
      role: 'assistant',
      content: CHATBOT_CONFIG.WELCOME_MESSAGE,
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }, [])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSendMessage = useCallback((content: string) => {
    const userMessage: ChatMessageType = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)

      const responses = CHATBOT_CONFIG.DEMO_RESPONSES
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const botMessage: ChatMessageType = {
        id: generateId(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])

      if (messages.length === 1) {
        const newHistoryItem = {
          id: activeChatId || generateId(),
          title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
          time: getTimeString(new Date()),
          date: new Date(),
        }

        setChatHistory((prev) => {
          const updated = [...prev]
          if (updated[0]?.label === 'Today') {
            const existingIndex = updated[0].items.findIndex(
              (item) => item.id === activeChatId
            )
            if (existingIndex >= 0) {
              updated[0].items[existingIndex] = newHistoryItem
            } else {
              updated[0].items.unshift(newHistoryItem)
            }
          } else {
            updated.unshift({
              label: 'Today',
              items: [newHistoryItem],
            })
          }
          localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(updated))
          return updated
        })
      }
    }, 1500 + Math.random() * 1000)
  }, [messages.length, activeChatId])

  const handleNewChat = () => {
    const newChatId = generateId()
    setActiveChatId(newChatId)
    setMessages([
      {
        id: generateId(),
        role: 'assistant',
        content: CHATBOT_CONFIG.WELCOME_MESSAGE,
        timestamp: new Date(),
      },
    ])
    setSidebarOpen(false)
  }

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId)
    setMessages([
      {
        id: generateId(),
        role: 'assistant',
        content: CHATBOT_CONFIG.WELCOME_MESSAGE,
        timestamp: new Date(),
      },
    ])
    setSidebarOpen(false)
  }

  const handleSubscriptionSuccess = (plan: SubscriptionPlan) => {
    const expiresAt = new Date()
    if (plan.id === 'daily') {
      expiresAt.setDate(expiresAt.getDate() + 1)
    } else {
      expiresAt.setDate(expiresAt.getDate() + 30)
    }

    const newSubscription: UserSubscription = {
      isActive: true,
      plan,
      expiresAt,
    }

    setSubscription(newSubscription)
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(newSubscription))
    setShowSubscriptionModal(false)
  }

  // Theme-aware styles
  const getPageStyle = (): React.CSSProperties => ({
    backgroundColor: isLight ? '#F9FAFB' : '#1A1A1A',
  })

  const getMainAreaStyle = (): React.CSSProperties => ({
    backgroundColor: isLight ? '#FFFFFF' : '#1A1A1A',
  })

  const getChatContainerStyle = (): React.CSSProperties => ({
    backgroundColor: isLight ? '#FFFFFF' : '#1A1A1A',
    scrollbarWidth: 'thin',
    scrollbarColor: isLight ? '#D1D5DB transparent' : '#2A2A2A transparent',
  })

  const getLoadingSpinnerStyle = (): React.CSSProperties => ({
    borderColor: isLight ? 'rgba(16, 216, 69, 0.2)' : 'rgba(16, 216, 69, 0.2)',
    borderTopColor: '#00D666',
  })

  if (!hasCheckedSubscription) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={getPageStyle()}
      >
        <div 
          className="w-12 h-12 border-4 rounded-full animate-spin"
          style={getLoadingSpinnerStyle()}
        />
      </div>
    )
  }

  return (
    <div 
      className="h-screen flex flex-col overflow-hidden"
      style={getPageStyle()}
    >
      <CompactHeader />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <ChatSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          chatHistory={chatHistory}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
        />

        <main 
          className="flex-1 flex flex-col min-w-0 overflow-hidden"
          style={getMainAreaStyle()}
        >
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 md:p-8"
            style={getChatContainerStyle()}
          >
            <div className="flex flex-col">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <TypingIndicator isVisible={isTyping} />
            </div>
          </div>

          <ChatInput
            onSend={handleSendMessage}
            disabled={isTyping}
            placeholder="Ask me anything..."
          />
        </main>
      </div>

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onPaymentSuccess={handleSubscriptionSuccess}
      />
    </div>
  )
}