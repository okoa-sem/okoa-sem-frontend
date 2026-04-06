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
import { useChatAccess, useSubscriptionHistory } from '@/features/payments/hooks/payments.hooks'
import { useAuth } from '@/app/providers/authentication-provider/AuthenticationProvider'
import { useWebSocketMessage } from '@/features/chatbot/hooks/websocket/useWebSocketMessage'
import { chatService } from '@/features/chatbot/services/chatService'

const generateId = () => Math.random().toString(36).substr(2, 9)

const getTimeString = (date: Date) =>
  date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

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
  const pendingMessageRef = useRef<string | null>(null)
  // Track whether we're waiting for the WS to connect before sending
  const waitingForConnectionRef = useRef(false)

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
    // autoConnect: only connect when we have a session and an active subscription
    !!(activeChatId && subscription.isActive),
    useCallback(() => {}, []),
    useCallback(() => {}, [])
  )

  // Theme detection
  useEffect(() => {
    const checkTheme = () => setIsLight(document.body.classList.contains('light-theme'))
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.body, { attributes: true })
    return () => observer.disconnect()
  }, [])

  const { data: hasAccess = false, isLoading: isCheckingAccess } = useChatAccess()
  const { data: subscriptionHistory = [] } = useSubscriptionHistory()
  const activeSubscription = subscriptionHistory.find(s => s.isActive || s.status === 'ACTIVE')

  // Subscription gate check
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
      // Fallback to cached subscription
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

  // Welcome message
  useEffect(() => {
    setMessages([{
      id: generateId(),
      role: 'assistant',
      content: CHATBOT_CONFIG.WELCOME_MESSAGE,
      timestamp: new Date(),
    }])
  }, [])

  // Load sessions into sidebar whenever subscription becomes active
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

  // Auto-scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, isTyping])


  // waitingForConnectionRef guards against duplicate sends.
  useEffect(() => {
    if (activeChatId && isConnected && pendingMessageRef.current && waitingForConnectionRef.current) {
      waitingForConnectionRef.current = false
      const msg = pendingMessageRef.current
      pendingMessageRef.current = null

      sendViaWebSocket(msg).catch((err) => {
        console.error('[ChatbotPage] Failed to send pending message:', err)
        setIsTyping(false)
        setMessages((prev) => prev.filter(m => m.role !== 'assistant' || m.content !== ''))
      })
    }
  }, [activeChatId, isConnected, sendViaWebSocket])

  // Update assistant placeholder with streamed content
  useEffect(() => {
    if (!streamedContent) return
    setMessages((prev) => {
      if (!prev.length) return prev
      const last = prev[prev.length - 1]
      if (last.role !== 'assistant' || last.content === streamedContent) return prev
      const updated = [...prev]
      updated[updated.length - 1] = { ...last, content: streamedContent }
      return updated
    })
  }, [streamedContent])

  // Streaming complete
  useEffect(() => {
    if (fullResponse && !isLoading) {
      setIsTyping(false)
      // Refresh sidebar to update timestamps/titles
      loadSessions()
    }
  }, [fullResponse, isLoading])

  // Show WS errors to user
  useEffect(() => {
    if (wsError && isTyping) {
      console.error('[ChatbotPage] WebSocket error:', wsError)
      setIsTyping(false)
      setMessages((prev) => {
        // Replace empty assistant placeholder with error message
        const last = prev[prev.length - 1]
        if (last?.role === 'assistant' && !last.content) {
          const updated = [...prev]
          updated[updated.length - 1] = {
            ...last,
            content: '⚠️ Failed to get a response. Please try again.',
          }
          return updated
        }
        return prev
      })
    }
  }, [wsError, isTyping])

  const handleSendMessage = useCallback(async (content: string) => {
    if (!subscription.isActive) {
      setShowSubscriptionModal(true)
      return
    }

    const userMsg: ChatMessageType = { id: generateId(), role: 'user', content, timestamp: new Date() }
    const assistantPlaceholder: ChatMessageType = { id: generateId(), role: 'assistant', content: '', timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg, assistantPlaceholder])
    setIsTyping(true)

    if (!activeChatId) {
      // Create session first, then WS will connect, then pending message will send
      setIsCreatingSession(true)
      try {
        const session = await chatService.createSession()

        // Store message and flag that we're waiting for WS connection
        pendingMessageRef.current = content
        waitingForConnectionRef.current = true

        setActiveChatId(session.sessionId)

        // Optimistic sidebar update
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
        setMessages((prev) => prev.slice(0, -2))
      } finally {
        setIsCreatingSession(false)
      }
      return
    }

    // Session already exists — send directly if connected
    if (isConnected) {
      try {
        await sendViaWebSocket(content)
      } catch (err) {
        console.error('[ChatbotPage] sendMessage failed:', err)
        setIsTyping(false)
        setMessages((prev) => prev.slice(0, -2))
      }
    } else {
      // WS not connected yet — queue the message
      console.warn('[ChatbotPage] WS not connected, queuing message')
      pendingMessageRef.current = content
      waitingForConnectionRef.current = true
    }
  }, [activeChatId, isConnected, sendViaWebSocket, subscription.isActive])

  const handleNewChat = async () => {
    setIsCreatingSession(true)
    try {
      const session = await chatService.createSession()
      setActiveChatId(session.sessionId)
      setMessages([{ id: generateId(), role: 'assistant', content: CHATBOT_CONFIG.WELCOME_MESSAGE, timestamp: new Date() }])

      const newItem = { id: session.sessionId, title: session.title || 'New Chat', time: getTimeString(new Date()), date: new Date() }
      setChatHistory((prev) => {
        const todaySection = prev.find(s => s.label === 'Today')
        if (todaySection) return prev.map(s => s.label === 'Today' ? { ...s, items: [newItem, ...s.items] } : s)
        return [{ label: 'Today', items: [newItem] }, ...prev]
      })
    } catch (err) {
      console.error('[ChatbotPage] handleNewChat failed:', err)
    } finally {
      setIsCreatingSession(false)
      setSidebarOpen(false)
    }
  }

  const handleSelectChat = async (chatId: string) => {
    setActiveChatId(chatId)
    setSidebarOpen(false)
    setIsTyping(false)
    pendingMessageRef.current = null
    waitingForConnectionRef.current = false

    try {
      const session = await chatService.getSessionById(chatId)
      if (session.messages?.length) {
        setMessages(session.messages.map((m) => ({
          id: m.messageId,
          role: m.role === 'USER' ? 'user' : 'assistant' as 'user' | 'assistant',
          content: m.content,
          timestamp: new Date(m.createdAt),
        })))
      } else {
        setMessages([{ id: generateId(), role: 'assistant', content: CHATBOT_CONFIG.WELCOME_MESSAGE, timestamp: new Date() }])
      }
    } catch {
      setMessages([{ id: generateId(), role: 'assistant', content: CHATBOT_CONFIG.WELCOME_MESSAGE, timestamp: new Date() }])
    }
  }

  const handleSubscriptionSuccess = (plan?: SubscriptionPlan) => {
    const resolvedPlan = plan ?? { id: 'monthly' as const, name: 'Monthly Plan', duration: '30 days access', durationLabel: '30 Days', price: 250 }
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + (resolvedPlan.id === 'daily' ? 1 : resolvedPlan.id === 'weekly' ? 7 : 30))
    setSubscription({ isActive: true, plan: resolvedPlan, expiresAt })
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify({ isActive: true, expiresAt: expiresAt.toISOString() }))
    setShowSubscriptionModal(false)
    checkAuthentication()
  }

  // NOTE: usePayments() was removed from this page intentionally.
  // It was creating a second PaymentWebSocket (/ws/payments) that failed with 1006
  // and flooded the console. Payment success is handled by SubscriptionModal's
  // internal polling + WebSocket, which calls onPaymentSuccess directly.
  // The global PaymentProvider in (user)/layout.tsx still handles payment events.

  const loadingSpinnerStyle: React.CSSProperties = { borderColor: 'rgba(16, 216, 69, 0.2)', borderTopColor: '#00D666' }

  if (!hasCheckedSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: isLight ? '#F9FAFB' : '#1A1A1A' }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin" style={loadingSpinnerStyle} />
      </div>
    )
  }

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
        />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ backgroundColor: isLight ? '#FFFFFF' : '#1A1A1A' }}>
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 md:p-8"
            style={{ backgroundColor: isLight ? '#FFFFFF' : '#1A1A1A', scrollbarWidth: 'thin' }}
          >
            <div className="flex flex-col">
              {messages.map((message) => <ChatMessage key={message.id} message={message} />)}
              {/* Show typing indicator only when waiting and no streamed content yet */}
              <TypingIndicator isVisible={isTyping && !streamedContent} />
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