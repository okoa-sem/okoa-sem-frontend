'use client'

import { useState, useEffect } from 'react'
import { Bot, Download, ShieldCheck, Check } from 'lucide-react'

const benefits = [
  {
    icon: Bot,
    title: 'Premium AI Chat',
    description: 'Unlock intelligent conversations with our AI study assistant',
    features: [
      'AI-Powered Assistance - Get instant help with your academic questions',
      'Unlimited Conversations - Chat without limits on any topic',
      'Study Guidance - Personalized learning recommendations',
    ],
  },
  {
    icon: Download,
    title: 'Offline Downloads',
    description: 'Access your study materials anytime, anywhere',
    features: [
      'Download unlimited PDFs',
      'Save images and notes',
      'Track storage usage',
      'Filter by file type',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Verified Account',
    description: 'Secure and personalized experience',
    features: [
      'Verified account status',
      'Email-based authentication',
      'Track membership history',
      'Monitor last activity',
    ],
  },
]

export default function BenefitsSection() {
  const [isLight, setIsLight] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

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

  const getSectionStyle = (): React.CSSProperties => ({
    background: isLight 
      ? '#E8F6E8' 
      : '#0A0A0A',
    padding: '80px 0',
  })

  const getHeaderStyle = (): React.CSSProperties => ({
    color: '#00D666',
  })

  const getSubtitleStyle = (): React.CSSProperties => ({
    color: isLight ? '#6B7280' : '#A0A0A0',
  })

  const getCardStyle = (isHovered: boolean): React.CSSProperties => ({
    backgroundColor: isLight ? '#FFFFFF' : '#1A1A1A',
    border: isHovered 
      ? '2px solid #00D666' 
      : (isLight ? '2px solid #E5E7EB' : '2px solid #2A2A2A'),
    borderRadius: '20px',
    padding: '32px',
    transition: 'all 0.4s ease',
    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
    boxShadow: isHovered 
      ? (isLight 
          ? '0 20px 40px rgba(16, 216, 69, 0.15)' 
          : '0 20px 40px rgba(16, 216, 69, 0.2)')
      : (isLight 
          ? '0 4px 6px rgba(0, 0, 0, 0.05)' 
          : 'none'),
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
  })

  const getIconContainerStyle = (): React.CSSProperties => ({
    backgroundColor: isLight ? 'rgba(16, 216, 69, 0.1)' : 'rgba(16, 216, 69, 0.15)',
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  })

  const getIconStyle = (): React.CSSProperties => ({
    color: '#00D666',
    width: '28px',
    height: '28px',
  })

  const getTitleStyle = (): React.CSSProperties => ({
    color: '#00D666',
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '8px',
  })

  const getDescriptionStyle = (): React.CSSProperties => ({
    color: isLight ? '#6B7280' : '#A0A0A0',
    fontSize: '0.95rem',
    marginBottom: '24px',
  })

  const getFeatureListStyle = (): React.CSSProperties => ({
    backgroundColor: isLight ? '#F9FAFB' : 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    padding: '20px',
    flex: 1,
  })

  const getFeatureItemStyle = (): React.CSSProperties => ({
    color: isLight ? '#374151' : '#E5E5E5',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
  })

  const getCheckIconStyle = (): React.CSSProperties => ({
    color: '#00D666',
    width: '18px',
    height: '18px',
    flexShrink: 0,
    marginTop: '2px',
  })

  return (
    <section 
      id="benefits" 
      className="section-padding"
      style={getSectionStyle()}
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={getHeaderStyle()}
          >
            Premium Features & Benefits
          </h2>
          <p 
            className="text-xl"
            style={getSubtitleStyle()}
          >
            Everything you get with a premium subscription
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <div
                key={benefit.title}
                style={getCardStyle(hoveredIndex === index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Icon */}
                <div style={getIconContainerStyle()}>
                  <IconComponent style={getIconStyle()} />
                </div>

                {/* Title */}
                <h3 style={getTitleStyle()}>
                  {benefit.title}
                </h3>

                {/* Description */}
                <p style={getDescriptionStyle()}>
                  {benefit.description}
                </p>

                {/* Features List */}
                <div style={getFeatureListStyle()}>
                  {benefit.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex} 
                      style={{
                        ...getFeatureItemStyle(),
                        marginBottom: featureIndex === benefit.features.length - 1 ? 0 : '12px',
                      }}
                    >
                      <Check style={getCheckIconStyle()} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}