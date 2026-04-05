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
import { useChatAccess, useSubscriptionHistory } from '@/features/payments/hooks/payments.hooks'
import { useAuth } from '@/app/providers/authentication-provider/AuthenticationProvider'
import { useWebSocketMessage } from '@/features/chatbot/hooks/websocket/useWebSocketMessage'
import { chatService } from '@/features/chatbot/services/chatService'

const generateId = () => Math.random().toString(36).substr(2, 9)

const getTimeString = (date: Date) => {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

const generateDemoChatHistory = (): ChatHistorySection[] => {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  return [
    { label: 'Today', items: [{ id: 'chat-1', title: 'Help with calculus', time: '14:20', date: now }] },
    { label: 'Yesterday', items: [{ id: 'chat-2', title: 'Physics homework', time: '16:45', date: yesterday }] }
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
  const pendingMessageRef = useRef<string | null>(null)
  const { user, checkAuthentication } = useAuth()

  const authToken = typeof window !== 'undefined' 
    ? localStorage.getItem('authToken') || null
    : null

  // FIX: Memoize callbacks to avoid re-renders
  const handleMessageReceived = useCallback((message: any) => {}, []);
  const handleWebSocketError = useCallback((error: any) => {}, []);

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
    !!activeChatId && subscription.isActive,
    handleMessageReceived,
    handleWebSocketError
  )

  useEffect(() => {
    const checkTheme = () => setIsLight(document.body.classList.contains('light-theme'))
    checkTheme()
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') checkTheme()
      })
    })
    observer.observe(document.body, { attributes: true })
    return () => observer.disconnect()
  }, [])

  const { data: hasAccess = false, isLoading: isCheckingAccess } = useChatAccess();
  const { data: subscriptionHistory = [] } = useSubscriptionHistory();

  const activeSubscription = subscriptionHistory.find(sub => sub.isActive || sub.status === 'ACTIVE');

  useEffect(() => {
    if (!isCheckingAccess) {
      if (hasAccess) {
        setSubscription({ isActive: true });
        setShowSubscriptionModal(false);
        if (activeSubscription) {
          const expiresAt = new Date(activeSubscription.endDate);
          localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify({ 
            isActive: true, expiresAt: expiresAt.toISOString(), plan: activeSubscription.subscriptionType 
          }));
        }
      } else {
        const savedSubscription = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
        if (savedSubscription) {
          try {
            const parsed = JSON.parse(savedSubscription);
            if (new Date(parsed.expiresAt) > new Date()) {
              setSubscription({ isActive: true });
              setShowSubscriptionModal(false);
              setHasCheckedSubscription(true);
              return;
            }
          } catch {}
        }
        setSubscription({ isActive: false });
        setShowSubscriptionModal(true);
      }
      setHasCheckedSubscription(true);
    }
  }, [hasAccess, isCheckingAccess, activeSubscription]);

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY)
    if (savedHistory) {
      try { setChatHistory(JSON.parse(savedHistory)) } 
      catch { setChatHistory(generateDemoChatHistory()) }
    } else {
      setChatHistory(generateDemoChatHistory())
    }

    setMessages([{ id: generateId(), role: 'assistant', content: CHATBOT_CONFIG.WELCOME_MESSAGE, timestamp: new Date() }])
  }, [])

  useEffect(() => {
    if (subscription.isActive && !showSubscriptionModal) {
      const loadSessions = async () => {
        try {
          const sessions = await chatService.getAllSessions()
          if (sessions && sessions.length > 0) {
            setChatHistory([{
              label: 'Today',
              items: sessions.map((session) => ({
                id: session.sessionId, title: session.title, time: getTimeString(new Date(session.createdAt)), date: new Date(session.createdAt),
              })),
            }])
            if (!activeChatId) setActiveChatId(sessions[0].sessionId)
          }
        } catch (error) {}
      }
      loadSessions()
    }
  }, [subscription.isActive, showSubscriptionModal, activeChatId])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, isTyping])

  useEffect(() => {
    if (activeChatId && isConnected && pendingMessageRef.current) {
      const msg = pendingMessageRef.current
      pendingMessageRef.current = null
      sendViaWebSocket(msg).catch(() => {
        setIsTyping(false)
        setMessages((prev) => prev.slice(0, -1))
      })
    }
  }, [activeChatId, isConnected, sendViaWebSocket])

  const handleSendMessage = useCallback(async (content: string) => {
    if (!activeChatId) {
      setIsCreatingSession(true)
      try {
        const session = await chatService.createSession()
        setMessages((prev) => [...prev, { id: generateId(), role: 'user', content, timestamp: new Date() }, { id: generateId(), role: 'assistant', content: '', timestamp: new Date() }])
        setIsTyping(true)
        pendingMessageRef.current = content
        setActiveChatId(session.sessionId)
      } catch (error) {
      } finally { setIsCreatingSession(false) }
      return
    }

    setMessages((prev) => [...prev, { id: generateId(), role: 'user', content, timestamp: new Date() }, { id: generateId(), role: 'assistant', content: '', timestamp: new Date() }])
    setIsTyping(true)

    try { await sendViaWebSocket(content) } 
    catch (error) { setIsTyping(false); setMessages((prev) => prev.slice(0, -1)) }
  }, [activeChatId, sendViaWebSocket])

  useEffect(() => {
    if (activeChatId && pendingMessageRef.current && !subscription.isActive) {
      pendingMessageRef.current = null;
      setIsTyping(false);
      setMessages((prev) => prev.slice(0, -1));
      setShowSubscriptionModal(true);
    }
  }, [activeChatId, subscription.isActive]);

  useEffect(() => {
    if (streamedContent && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'assistant') {
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { ...updated[updated.length - 1], content: streamedContent }
          return updated
        })
      }
    }
  }, [streamedContent])

  useEffect(() => {
    if (fullResponse && !isLoading) setIsTyping(false)
  }, [fullResponse, isLoading])

  const handleNewChat = async () => {
    setIsCreatingSession(true)
    try {
      const session = await chatService.createSession()
      setActiveChatId(session.sessionId)
      setMessages([{ id: generateId(), role: 'assistant', content: CHATBOT_CONFIG.WELCOME_MESSAGE, timestamp: new Date() }])
    } catch (error) {
    } finally { setIsCreatingSession(false); setSidebarOpen(false) }
  }

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId)
    setMessages([{ id: generateId(), role: 'assistant', content: CHATBOT_CONFIG.WELCOME_MESSAGE, timestamp: new Date() }])
    setSidebarOpen(false)
  }

  const handleSubscriptionSuccess = (plan?: SubscriptionPlan) => {
    const resolvedPlan = plan ?? { id: 'monthly' as const, name: 'Monthly Plan', duration: '30 days access', durationLabel: '30 Days', price: 130 }
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + (resolvedPlan.id === 'daily' ? 1 : 30))
    const subData: UserSubscription = { isActive: true, plan: resolvedPlan, expiresAt }
    setSubscription(subData)
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify({ ...subData, expiresAt: expiresAt.toISOString() }))
    setShowSubscriptionModal(false)
    checkAuthentication()
  }

  usePayments(handleSubscriptionSuccess)

  const getPageStyle = (): React.CSSProperties => ({ backgroundColor: isLight ? '#F9FAFB' : '#1A1A1A' })
  const getMainAreaStyle = (): React.CSSProperties => ({ backgroundColor: isLight ? '#FFFFFF' : '#1A1A1A' })
  const getChatContainerStyle = (): React.CSSProperties => ({ backgroundColor: isLight ? '#FFFFFF' : '#1A1A1A', scrollbarWidth: 'thin', scrollbarColor: isLight ? '#D1D5DB transparent' : '#2A2A2A transparent' })
  const getLoadingSpinnerStyle = (): React.CSSProperties => ({ borderColor: isLight ? 'rgba(16, 216, 69, 0.2)' : 'rgba(16, 216, 69, 0.2)', borderTopColor: '#00D666' })

  if (!hasCheckedSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={getPageStyle()}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin" style={getLoadingSpinnerStyle()} />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={getPageStyle()}>
      <CompactHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <ChatSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} chatHistory={chatHistory} activeChatId={activeChatId} onSelectChat={handleSelectChat} onNewChat={handleNewChat} />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden" style={getMainAreaStyle()}>
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-8" style={getChatContainerStyle()}>
            <div className="flex flex-col">
              {messages.map((message) => <ChatMessage key={message.id} message={message} />)}
              <TypingIndicator isVisible={isTyping} />
            </div>
          </div>
          <ChatInput onSend={handleSendMessage} disabled={isTyping} placeholder="Ask me anything..." />
        </main>
      </div>
      <SubscriptionModal isOpen={showSubscriptionModal} onClose={() => setShowSubscriptionModal(false)} onPaymentSuccess={handleSubscriptionSuccess} />
    </div>
  )
}