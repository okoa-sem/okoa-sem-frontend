'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Upload, CheckSquare, HelpCircle } from 'lucide-react'

const features = [
  {
    title: 'Chat History',
    description: 'All your conversations saved and searchable for future reference.',
    icon: 'chat',
  },
  {
    title: 'Upload Past Papers',
    description: 'Share PDFs directly with the AI for instant analysis and answers.',
    icon: 'upload',
  },
  {
    title: 'Generate Marking Schemes',
    description: 'Get comprehensive AI-generated answers and marking rubrics.',
    icon: 'check',
  },
  {
    title: 'Study Guidance',
    description: 'Personalized learning recommendations based on your progress.',
    icon: 'help',
  },
]


export default function AIAssistantSection() {
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

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'chat':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )
      case 'upload':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        )
      case 'check':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
        )
      case 'help':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <section 
      id="ai-assistant" 
      className="section-padding relative overflow-hidden"
      style={{
      
        background: isLight ? '#E6FFF0' : '#1A1A1A',
        color: isLight ? '#1A1A1A' : '#FFFFFF',
      }}
    >
      {/* Background gradient effects */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isLight
            ? 'radial-gradient(circle at 30% 30%, rgba(0, 214, 102, 0.08) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(0, 214, 102, 0.05) 0%, transparent 50%)'
            : 'radial-gradient(circle at 30% 30%, rgba(0, 214, 102, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(0, 214, 102, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-custom relative z-10">
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 1024 ? '1fr 1fr' : '1fr',
            gap: '80px',
            alignItems: 'center',
          }}
        >
          {/* Left Content */}
          <div>
            {/* Section Label */}
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                position: 'relative',
                marginBottom: '24px',
              }}
            >
              <div 
                style={{
                  width: '32px',
                  height: '2px',
                  background: '#00D666',
                }}
              />
              <span 
                style={{
                  color: '#00D666',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                AI Study Bot
              </span>
              <div 
                style={{
                  width: '32px',
                  height: '2px',
                  background: '#00D666',
                }}
              />
            </div>

            {/* Title */}
            <h2 
              style={{
                fontSize: 'clamp(2rem, 5vw, 2.75rem)',
                fontWeight: 700,
                marginBottom: '24px',
                lineHeight: 1.2,
                color: isLight ? '#1A1A1A' : '#FFFFFF',
              }}
            >
              Meet Your Personal AI Study Companion
            </h2>

            {/* Description */}
            <p 
              style={{
                fontSize: '1.1rem',
                color: isLight ? 'rgba(26, 26, 26, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                marginBottom: '40px',
                lineHeight: 1.6,
              }}
            >
              Our advanced AI assistant powered by GPT-4 understands your academic needs and provides personalized help whenever you need it.
            </p>

            {/* Features List */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                marginBottom: '40px',
              }}
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                  }}
                >
                  {/* Icon */}
                  <div 
                    style={{
                      width: '48px',
                      height: '48px',
                      background: isLight ? 'rgba(0, 214, 102, 0.1)' : 'rgba(0, 214, 102, 0.15)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: '#00D666',
                    }}
                  >
                    {getIcon(feature.icon)}
                  </div>

                  {/* Text */}
                  <div>
                    <h4 
                      style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        marginBottom: '4px',
                        color: isLight ? '#1A1A1A' : '#FFFFFF',
                      }}
                    >
                      {feature.title}
                    </h4>
                    <p 
                      style={{
                        fontSize: '0.9rem',
                        color: isLight ? 'rgba(26, 26, 26, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                        lineHeight: 1.5,
                      }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              style={{
                padding: '16px 32px',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#FFFFFF',
                background: 'linear-gradient(135deg, #00D666, #00B355)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0, 214, 102, 0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 214, 102, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 214, 102, 0.3)'
              }}
            >
              Try AI Assistant
            </button>
          </div>

          {/* Right Visual - Chatbot Mockup */}
          <div 
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div style={{ position: 'relative' }}>
              {/* Chatbot Interface Mockup */}
              <div
                style={{
                  width: '450px',
                  height: '600px',
                  borderRadius: '16px',
                  boxShadow: isLight 
                    ? '0 32px 64px rgba(0, 0, 0, 0.12)'
                    : '0 32px 64px rgba(0, 0, 0, 0.5)',
                  border: isLight ? '1px solid #E5E7EB' : '1px solid #333',
                  background: isLight ? '#FFFFFF' : '#111827',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Chat Header */}
                <div
                  style={{
                    padding: '20px 24px',
                    borderBottom: isLight ? '1px solid #E5E7EB' : '1px solid #374151',
                    background: isLight ? '#FAFAFA' : '#1F2937',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#00D666',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: isLight ? '#1A1A1A' : '#FFFFFF',
                        }}
                      >
                        Okoa Sem AI Assistant
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#00D666',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00D666' }} />
                        Online
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Messages Area */}
                <div
                  style={{
                    flex: 1,
                    padding: '24px',
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    background: isLight ? '#FFFFFF' : '#0A0A0A',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  }}
                  className="scrollbar-hidden"
                >
                  {/* User Message */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div
                      style={{
                        maxWidth: '75%',
                        background: isLight ? '#00D666' : '#3A4A3A',
                        padding: '12px 16px',
                        borderRadius: '18px 18px 4px 18px',
                        fontSize: '0.875rem',
                        color: '#FFFFFF',
                      }}
                    >
                      Explain the concept of polymorphism in Object-Oriented Programming
                    </div>
                  </div>

                  {/* Bot Message */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#00D666',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </div>
                    <div
                      style={{
                        maxWidth: '75%',
                        background: isLight ? '#F3F4F6' : '#2A2A2A',
                        padding: '12px 16px',
                        borderRadius: '4px 18px 18px 18px',
                        fontSize: '0.875rem',
                        color: isLight ? '#1F2937' : '#FFFFFF',
                        lineHeight: 1.6,
                        border: isLight ? '1px solid #E5E7EB' : 'none',
                      }}
                    >
                      <p style={{ margin: 0, marginBottom: '12px' }}>
                        <strong>Polymorphism</strong> is one of the fundamental concepts in Object-Oriented Programming (OOP) that allows objects to take multiple forms.
                      </p>
                      <p style={{ margin: 0, marginBottom: '12px' }}>
                        There are two main types:
                      </p>
                      <p style={{ margin: 0, marginBottom: '8px' }}>
                        <strong>1. Compile-time Polymorphism:</strong> Method overloading
                      </p>
                      <p style={{ margin: 0 }}>
                        <strong>2. Runtime Polymorphism:</strong> Method overriding
                      </p>
                    </div>
                  </div>

                  {/* User Follow-up */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div
                      style={{
                        maxWidth: '75%',
                        background: isLight ? '#00D666' : '#3A4A3A',
                        padding: '12px 16px',
                        borderRadius: '18px 18px 4px 18px',
                        fontSize: '0.875rem',
                        color: '#FFFFFF',
                      }}
                    >
                      Can you give me a simple example?
                    </div>
                  </div>

                  {/* Typing Indicator */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#00D666',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </div>
                    <div
                      style={{
                        background: isLight ? '#F3F4F6' : '#2A2A2A',
                        padding: '16px 20px',
                        borderRadius: '4px 18px 18px 18px',
                        display: 'flex',
                        gap: '6px',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: isLight ? '#9CA3AF' : '#6B7280',
                          animation: 'bounce 1.4s infinite ease-in-out both',
                        }}
                      />
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: isLight ? '#9CA3AF' : '#6B7280',
                          animation: 'bounce 1.4s infinite ease-in-out both 0.2s',
                        }}
                      />
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: isLight ? '#9CA3AF' : '#6B7280',
                          animation: 'bounce 1.4s infinite ease-in-out both 0.4s',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div
                  style={{
                    padding: '16px 24px',
                    borderTop: isLight ? '1px solid #E5E7EB' : '1px solid #374151',
                    background: isLight ? '#FFFFFF' : '#0A0A0A',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px 16px',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Ask me anything..."
                      disabled
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: isLight ? '#6B7280' : '#9CA3AF',
                        fontSize: '0.875rem',
                      }}
                    />
                    <button
                      style={{
                        background: '#00D666',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Typing animation */}
          <style jsx>{`
            @keyframes bounce {
              0%, 80%, 100% {
                transform: scale(0);
                opacity: 0.5;
              }
              40% {
                transform: scale(1);
                opacity: 1;
              }
            }
            .scrollbar-hidden::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
      </div>
    </section>
  )
}
