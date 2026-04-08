'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { ChatMessage as ChatMessageType, ChatHistorySection, SubscriptionPlan, UserSubscription } from '@/types'
import { CHATBOT_CONFIG, STORAGE_KEYS } from '@/shared/constants'
import CompactHeader from '@/shared/components/CompactHeader'
import ChatSidebar from '@/features/chatbot/components/ChatSidebar'
import ChatMessage from '@/features/chatbot/components/ChatMessage'
import TypingIndicator from '@/features/chatbot/components/TypingIndicator'
import ChatInput from '@/features/chatbot/components/ChatInput'
import SubscriptionModal from '@/features/chatbot/components/SubscriptionModal'
import { useChatAccess, useSubscriptionHistory } from '@/features/payments/hooks/payments.hooks'
import { useAuth } from '@/app/providers/authentication-provider/AuthenticationProvider'
import { useWebSocketMessage } from '@/features/chatbot/hooks/websocket/useWebSocketMessage'
import { chatService } from '@/features/chatbot/services/chatService'

// ─── Constants ────────────────────────────────────────────────────────────────

// localStorage persists across refreshes AND tab closes — unlike sessionStorage
const ACTIVE_SESSION_KEY = 'okoa_sem_active_chat_session'

const generateId = () => Math.random().toString(36).substr(2, 9)

const getTimeString = (date: Date) =>
  date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

function makeWelcome(): ChatMessageType {
  return {
    id: generateId(),
    role: 'assistant',
    content: CHATBOT_CONFIG.WELCOME_MESSAGE,
    timestamp: new Date(),
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ChatbotPage() {
  const searchParams = useSearchParams()
  const paperId = searchParams?.get('paper')

  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [chatHistory, setChatHistory] = useState<ChatHistorySection[]>([])
  const [subscription, setSubscription] = useState<UserSubscription>({ isActive: false })
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [hasCheckedSubscription, setHasCheckedSubscription] = useState(false)
  const [isLight, setIsLight] = useState(false)
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [isRestoringSession, setIsRestoringSession] = useState(false)
  const [currentHour, setCurrentHour] = useState<number>(new Date().getHours())

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const pendingMessageRef = useRef<string | null>(null)
  const waitingForConnectionRef = useRef(false)

  
  const restoreTriggeredRef = useRef(false)

  useEffect(() => {
    setCurrentHour(new Date().getHours())
  }, [])

  const { user, checkAuthentication } = useAuth()
  const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') || null : null

  const {
    isLoading,
    isConnected,
    streamedContent,
    fullResponse,
    error: wsError,
    sendMessage: sendViaWebSocket,
  } = useWebSocketMessage(
    activeChatId,
    authToken,
    !!(activeChatId && subscription.isActive),
    useCallback(() => {}, []),
    useCallback(() => {}, [])
  )

  // ─── Theme detection ────────────────────────────────────────────────────────

  useEffect(() => {
    const checkTheme = () => setIsLight(document.body.classList.contains('light-theme'))
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.body, { attributes: true })
    return () => observer.disconnect()
  }, [])

  // ─── Subscription gate ──────────────────────────────────────────────────────

  const { data: hasAccess = false, isLoading: isCheckingAccess } = useChatAccess()
  const { data: subscriptionHistory = [] } = useSubscriptionHistory()
  const activeSubscription = subscriptionHistory.find(s => s.isActive || s.status === 'ACTIVE')

  useEffect(() => {
    if (isCheckingAccess) return

    if (hasAccess) {
      setSubscription({ isActive: true })
      setShowSubscriptionModal(false)
      if (activeSubscription) {
        localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify({
          isActive: true,
          expiresAt: new Date(activeSubscription.endDate).toISOString(),
          plan: activeSubscription.subscriptionType,
        }))
      }
    } else {
      try {
        const cached = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION)
        if (cached) {
          const parsed = JSON.parse(cached)
          if (new Date(parsed.expiresAt) > new Date()) {
            setSubscription({ isActive: true })
            setShowSubscriptionModal(false)
            setHasCheckedSubscription(true)
            return
          }
        }
      } catch {}
      setSubscription({ isActive: false })
      setShowSubscriptionModal(true)
    }
    setHasCheckedSubscription(true)
  }, [hasAccess, isCheckingAccess])

  

  useEffect(() => {
    // Wait for subscription check to complete
    if (!hasCheckedSubscription) return

    // Only ever run once per page load
    if (restoreTriggeredRef.current) return
    restoreTriggeredRef.current = true

    // Read subscription state — safe because both setState calls above are batched
    const isSubscribed = subscription.isActive

    if (!isSubscribed) {
      // No subscription — just show welcome, no API call needed
      setMessages([makeWelcome()])
      return
    }

    // Check if we have a paper ID query parameter for marking scheme context
    if (paperId) {
      // User is coming from marking scheme generation — create a new session for this paper
      setIsCreatingSession(true)
      chatService
        .createSessionWithContext(`Marking Scheme - Paper ${paperId}`, paperId)
        .then((newSession) => {
          setActiveChatId(newSession.sessionId)
          setMessages([makeWelcome()])
        })
        .catch((err) => {
          console.warn('[ChatbotPage] Failed to create paper-specific session:', err)
          setMessages([makeWelcome()])
        })
        .finally(() => {
          setIsCreatingSession(false)
        })
      return
    }

    const savedSessionId = localStorage.getItem(ACTIVE_SESSION_KEY)

    if (!savedSessionId) {
      // No previous session stored — fresh start
      setMessages([makeWelcome()])
      return
    }

    // Fetch the saved session from the backend
    setIsRestoringSession(true)
    chatService
      .getSessionById(savedSessionId)
      .then((session) => {
        if (session?.messages?.length) {
          setMessages(
            session.messages.map((m) => ({
              id: m.messageId,
              role: (m.role === 'USER' ? 'user' : 'assistant') as 'user' | 'assistant',
              content: m.content,
              timestamp: new Date(m.createdAt),
            }))
          )
          setActiveChatId(savedSessionId)
        } else {
          // Session exists on server but has no messages yet
          setMessages([makeWelcome()])
          setActiveChatId(savedSessionId)
        }
      })
      .catch((err) => {
        console.warn('[ChatbotPage] Failed to restore session, starting fresh:', err)
        // Session no longer exists on server — clear stale key
        localStorage.removeItem(ACTIVE_SESSION_KEY)
        setMessages([makeWelcome()])
      })
      .finally(() => {
        setIsRestoringSession(false)
      })

  }, [hasCheckedSubscription, paperId])

  // ─── Persist activeChatId to localStorage whenever it changes ───────────────

  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem(ACTIVE_SESSION_KEY, activeChatId)
    }
  }, [activeChatId])

  // ─── Load sessions into sidebar ─────────────────────────────────────────────

  const loadSessions = useCallback(async () => {
    if (!subscription.isActive) return
    try {
      const sessions = await chatService.getAllSessions()
      if (!sessions?.length) return

      const today = new Date(); today.setHours(0, 0, 0, 0)
      const todayItems: ChatHistorySection['items'] = []
      const earlierItems: ChatHistorySection['items'] = []

      sessions.forEach((session) => {
        const d = new Date(session.createdAt)
        const item = { id: session.sessionId, title: session.title || 'New Chat', time: getTimeString(d), date: d }
        if (d >= today) todayItems.push(item)
        else earlierItems.push(item)
      })

      const sections: ChatHistorySection[] = []
      if (todayItems.length) sections.push({ label: 'Today', items: todayItems })
      if (earlierItems.length) sections.push({ label: 'Earlier', items: earlierItems })
      setChatHistory(sections)
    } catch (e) {
      console.error('[ChatbotPage] loadSessions failed:', e)
    }
  }, [subscription.isActive])

  useEffect(() => { loadSessions() }, [loadSessions])

  // ─── Auto-scroll ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // ─── Send pending message once WS connects ──────────────────────────────────

  useEffect(() => {
    if (activeChatId && isConnected && pendingMessageRef.current && waitingForConnectionRef.current) {
      waitingForConnectionRef.current = false
      const msg = pendingMessageRef.current
      pendingMessageRef.current = null

      sendViaWebSocket(msg).catch((err) => {
        console.error('[ChatbotPage] Failed to send pending message:', err)
        setIsTyping(false)
        setMessages((prev) => prev.slice(0, -1))
      })
    }
  }, [activeChatId, isConnected, sendViaWebSocket])

  // ─── Update assistant placeholder with streamed content ─────────────────────

  useEffect(() => {
    if (!streamedContent) return
    setMessages((prev) => {
      const last = prev[prev.length - 1]
      // If last message is user, we need to create assistant placeholder first
      if (!last || last.role === 'user') {
        const assistantPlaceholder: ChatMessageType = { id: generateId(), role: 'assistant', content: streamedContent, timestamp: new Date() }
        return [...prev, assistantPlaceholder]
      }
      // Update existing assistant message
      if (last.role !== 'assistant' || last.content === streamedContent) return prev
      const updated = [...prev]
      updated[updated.length - 1] = { ...last, content: streamedContent }
      return updated
    })
  }, [streamedContent])

  // ─── Streaming complete ──────────────────────────────────────────────────────

  useEffect(() => {
    if (fullResponse && !isLoading) {
      setIsTyping(false)
      loadSessions()
    }
  }, [fullResponse, isLoading])

  // ─── WebSocket error handling ────────────────────────────────────────────────

  useEffect(() => {
    if (wsError && isTyping) {
      console.error('[ChatbotPage] WebSocket error:', wsError)
      setIsTyping(false)

      let userMessage = '⚠️ Failed to get a response. Please try again.'
      if (typeof wsError === 'string') {
        if (wsError.includes('content_filter') || wsError.includes('content management policy')) {
          userMessage = '⚠️ Your message was filtered by our content policy. Please rephrase and try again.'
        } else if (wsError.includes('jailbreak')) {
          userMessage = '⚠️ Your message appears to contain patterns we cannot process. Please try with different wording.'
        } else if (wsError.includes('timeout') || wsError.includes('connection')) {
          userMessage = '⚠️ Connection issue. Please check your internet and try again.'
        }
      }

      setMessages((prev) => {
        const last = prev[prev.length - 1]
        // If last message is user or there's no assistant message yet, create one
        if (!last || last.role === 'user') {
          const assistantError: ChatMessageType = { id: generateId(), role: 'assistant', content: userMessage, timestamp: new Date() }
          return [...prev, assistantError]
        }
        // If last message is assistant, update it with error
        if (last.role === 'assistant') {
          const updated = [...prev]
          updated[updated.length - 1] = { ...last, content: userMessage }
          return updated
        }
        return prev
      })
    }
  }, [wsError, isTyping])

  // ─── Send message ────────────────────────────────────────────────────────────

  const handleSendMessage = useCallback(async (content: string) => {
    if (!subscription.isActive) {
      setShowSubscriptionModal(true)
      return
    }

    const userMsg: ChatMessageType = { id: generateId(), role: 'user', content, timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    if (!activeChatId) {
      setIsCreatingSession(true)
      try {
        const session = await chatService.createSession()

        pendingMessageRef.current = content
        waitingForConnectionRef.current = true

        setActiveChatId(session.sessionId)
        localStorage.setItem(ACTIVE_SESSION_KEY, session.sessionId)

        const newItem = {
          id: session.sessionId,
          title: session.title || 'New Chat',
          time: getTimeString(new Date()),
          date: new Date(),
        }
        setChatHistory((prev) => {
          const todaySection = prev.find(s => s.label === 'Today')
          if (todaySection) {
            return prev.map(s => s.label === 'Today' ? { ...s, items: [newItem, ...s.items] } : s)
          }
          return [{ label: 'Today', items: [newItem] }, ...prev]
        })
      } catch (err) {
        console.error('[ChatbotPage] createSession failed:', err)
        setIsTyping(false)
        pendingMessageRef.current = null
        waitingForConnectionRef.current = false
        setMessages((prev) => prev.slice(0, -1))
      } finally {
        setIsCreatingSession(false)
      }
      return
    }

    if (isConnected) {
      try {
        await sendViaWebSocket(content)
      } catch (err) {
        console.error('[ChatbotPage] sendMessage failed:', err)
        setIsTyping(false)
        setMessages((prev) => prev.slice(0, -1))
      }
    } else {
      console.warn('[ChatbotPage] WS not connected, queuing message')
      pendingMessageRef.current = content
      waitingForConnectionRef.current = true
    }
  }, [activeChatId, isConnected, sendViaWebSocket, subscription.isActive])

  // ─── New chat ─────────────────────────────────────────────────────────────────

  const handleNewChat = async () => {
    // Don't create a session yet - just reset the UI for a new chat
    setActiveChatId(null)
    localStorage.removeItem(ACTIVE_SESSION_KEY)
    setMessages([])
    setIsTyping(false)
    pendingMessageRef.current = null
    waitingForConnectionRef.current = false
    setSidebarOpen(false)
  }

  // ─── Select existing chat ─────────────────────────────────────────────────────

  const handleSelectChat = async (chatId: string) => {
    setActiveChatId(chatId)
    localStorage.setItem(ACTIVE_SESSION_KEY, chatId)
    setSidebarOpen(false)
    setIsTyping(false)
    pendingMessageRef.current = null
    waitingForConnectionRef.current = false

    try {
      const session = await chatService.getSessionById(chatId)
      if (session?.messages?.length) {
        setMessages(session.messages.map((m) => ({
          id: m.messageId,
          role: (m.role === 'USER' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.content,
          timestamp: new Date(m.createdAt),
        })))
      } else {
        setMessages([makeWelcome()])
      }
    } catch {
      setMessages([makeWelcome()])
    }
  }

  // ─── Subscription success ─────────────────────────────────────────────────────

  const handleSubscriptionSuccess = (plan?: SubscriptionPlan) => {
    const resolvedPlan = plan ?? { id: 'monthly' as const, name: 'Monthly Plan', duration: '30 days access', durationLabel: '30 Days', price: 250 }
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + (resolvedPlan.id === 'daily' ? 1 : resolvedPlan.id === 'weekly' ? 7 : 30))
    setSubscription({ isActive: true, plan: resolvedPlan, expiresAt })
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify({ isActive: true, expiresAt: expiresAt.toISOString() }))
    setShowSubscriptionModal(false)
    checkAuthentication()
  }

  // ─── Loading state ────────────────────────────────────────────────────────────

  const loadingSpinnerStyle: React.CSSProperties = { borderColor: 'rgba(16, 216, 69, 0.2)', borderTopColor: '#00D666' }

  if (!hasCheckedSubscription || isRestoringSession) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: isLight ? '#F9FAFB' : '#1A1A1A' }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin" style={loadingSpinnerStyle} />
      </div>
    )
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: isLight ? '#F9FAFB' : '#1A1A1A' }}>
      <CompactHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <ChatSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          chatHistory={chatHistory}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={setSidebarCollapsed}
        />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ backgroundColor: isLight ? '#F9FAFB' : '#0F0F12' }}>
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto"
            style={{ backgroundColor: isLight ? '#F9FAFB' : '#0F0F12', scrollbarWidth: 'thin' }}
          >
            <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 flex flex-col">
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
                  {/* Welcome Message */}
                  <div className="text-center mb-12">
                    <h1
                      className="text-4xl md:text-5xl font-bold mb-4"
                      style={{ color: isLight ? '#1F2937' : '#FFFFFF' }}
                    >
                      Good {currentHour < 12 ? 'Morning' : currentHour < 18 ? 'Afternoon' : 'Evening'}
                    </h1>
                    <p
                      className="text-lg md:text-xl"
                      style={{ color: isLight ? '#6B7280' : '#A0A0A0' }}
                    >
                      How can I help you with your studies today?
                    </p>
                  </div>

                  {/* Suggested Prompts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                    {[
                      {
                        icon: '📚',
                        title: 'Explain a Concept',
                        prompt: 'Help me understand the concept of photosynthesis'
                      },
                      {
                        icon: '✏️',
                        title: 'Solve a Problem',
                        prompt: 'Solve this quadratic equation: x² + 5x + 6 = 0'
                      },
                      {
                        icon: '📝',
                        title: 'Essay Help',
                        prompt: 'Help me write an essay about the French Revolution'
                      },
                      {
                        icon: '🧠',
                        title: 'Quiz Me',
                        prompt: 'Create a quiz question about World War II'
                      }
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(suggestion.prompt)}
                        className="p-4 rounded-lg border transition-all hover:scale-105 active:scale-95"
                        style={{
                          borderColor: isLight ? '#E5E7EB' : '#2D2D2D',
                          backgroundColor: isLight ? '#F3F4F6' : '#1F1F23',
                          color: isLight ? '#1F2937' : '#FFFFFF',
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{suggestion.icon}</span>
                          <div className="text-left">
                            <p className="font-semibold">{suggestion.title}</p>
                            <p className="text-sm opacity-75">{suggestion.prompt}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 flex flex-col space-y-2">
                  {messages.map((message) => <ChatMessage key={message.id} message={message} />)}
                  <TypingIndicator isVisible={isTyping && !streamedContent} />
                </div>
              )}
            </div>
          </div>
          <ChatInput
            onSend={handleSendMessage}
            disabled={isTyping || isCreatingSession}
            placeholder={
              isCreatingSession ? 'Setting up chat...' :
              !isConnected && !!activeChatId ? 'Connecting...' :
              'Ask me anything...'
            }
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