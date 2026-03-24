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
import { usePayments } from '@/features/payments/hooks/usePayments'
import { useAuth } from '@/app/providers/authentication-provider/AuthenticationProvider'
import { useWebSocketMessage } from '@/features/chatbot/hooks/websocket/useWebSocketMessage'
import { chatService } from '@/features/chatbot/services/chatService'

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
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [chatHistory, setChatHistory] = useState<ChatHistorySection[]>([])
  const [subscription, setSubscription] = useState<UserSubscription>({ isActive: false })
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [hasCheckedSubscription, setHasCheckedSubscription] = useState(false)
  const [isLight, setIsLight] = useState(false)
  const [isCreatingSession, setIsCreatingSession] = useState(false)

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { user, checkAuthentication } = useAuth()

  // Get auth token
  const authToken = typeof window !== 'undefined' 
    ? localStorage.getItem('authToken') || null
    : null

  // WebSocket hook for real-time messaging
  const {
    isLoading,
    streamedContent,
    fullResponse,
    error: wsError,
    sendMessage: sendViaWebSocket,
  } = useWebSocketMessage(
    activeChatId,
    authToken,
    !!activeChatId && subscription.isActive, // autoConnect only if we have session and subscription
    (message) => {
      // Called when message is fully received
      console.log('[ChatbotPage] Message received:', message);
    },
    (error) => {
      // Called on error
      console.error('[ChatbotPage] WebSocket error:', error);
    }
  )

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
    if (subscription.isActive && !showSubscriptionModal) {
      // Load existing sessions from the API
      const loadSessions = async () => {
        try {
          const sessions = await chatService.getAllSessions()
          if (sessions && sessions.length > 0) {
            // Convert API sessions to chat history format
            const todayLabel = 'Today'
            const groupedSessions: ChatHistorySection[] = [
              {
                label: todayLabel,
                items: sessions.map((session) => ({
                  id: session.sessionId,
                  title: session.title,
                  time: getTimeString(new Date(session.createdAt)),
                  date: new Date(session.createdAt),
                })),
              },
            ]
            setChatHistory(groupedSessions)
            // Set the first session as active and load its messages
            if (!activeChatId && sessions.length > 0) {
              setActiveChatId(sessions[0].sessionId)
            }
          }
        } catch (error) {
          console.error('Failed to load chat sessions:', error)
          // Fall back to local storage
        }
      }
      loadSessions()
    }
  }, [subscription.isActive, showSubscriptionModal])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSendMessage = useCallback(async (content: string) => {
    // If no session, create one first
    if (!activeChatId) {
      setIsCreatingSession(true)
      try {
        const session = await chatService.createSession()
        setActiveChatId(session.sessionId)
        // Don't return here - continue to send message after setting session
      } catch (error) {
        console.error('Failed to create chat session:', error)
        setIsCreatingSession(false)
        return
      } finally {
        setIsCreatingSession(false)
      }
    }

    // Add user message to UI immediately
    const userMessage: ChatMessageType = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Create bot response placeholder
    const botMessageId = generateId()
    const botMessage: ChatMessageType = {
      id: botMessageId,
      role: 'assistant',
      content: '', // Will be filled as stream arrives
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, botMessage])
    setIsTyping(true)

    try {
      // Send message via WebSocket
      await sendViaWebSocket(content)
    } catch (error) {
      console.error('Failed to send message:', error)
      setIsTyping(false)
      // Remove the placeholder message on error
      setMessages((prev) => prev.slice(0, -1))
    }
  }, [activeChatId, sendViaWebSocket])

  // Update streaming content in real-time
  useEffect(() => {
    if (streamedContent && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'assistant') {
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: streamedContent,
          }
          return updated
        })
      }
    }
  }, [streamedContent])

  // Handle when streaming is complete
  useEffect(() => {
    if (fullResponse && !isLoading) {
      setIsTyping(false)
      console.log('[ChatbotPage] Stream complete:', fullResponse)
    }
  }, [fullResponse, isLoading])

  const handleNewChat = async () => {
    setIsCreatingSession(true)
    try {
      const session = await chatService.createSession()
      setActiveChatId(session.sessionId)
      setMessages([
        {
          id: generateId(),
          role: 'assistant',
          content: CHATBOT_CONFIG.WELCOME_MESSAGE,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error('Failed to create new chat session:', error)
    } finally {
      setIsCreatingSession(false)
      setSidebarOpen(false)
    }
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

  const handleSubscriptionSuccess = () => {
    setShowSubscriptionModal(false)
    checkAuthentication()
    alert('Payment successful! Your subscription is now active.')
  }

  usePayments(handleSubscriptionSuccess)

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
      <CompactHeader 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isSidebarOpen={sidebarOpen}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <ChatSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
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