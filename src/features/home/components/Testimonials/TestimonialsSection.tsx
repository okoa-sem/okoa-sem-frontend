'use client'

import { useState, useEffect } from 'react'

const testimonials = [
  {
    name: 'James Mwangi',
    initials: 'JM',
    school: 'Computer Science, SCI',
    text: 'Okoa Sem literally saved my semester! I was struggling to find past papers for Data Structures, but with their smart search feature, I found exactly what I needed in seconds. The AI study bot helped me understand complex algorithms. Highly recommend!',
    date: '2 weeks ago',
  },
  {
    name: 'Sarah Akinyi',
    initials: 'SA',
    school: 'Business Admin, SBE',
    text: 'The monthly plan is worth every shilling! I\'ve accessed papers from 3 years back, and the notes-to-questions feature is a game changer. I upload my lecture notes and get instant practice questions. My grades have improved significantly!',
    date: '1 month ago',
  },
  {
    name: 'David Kamau',
    initials: 'DK',
    school: 'Civil Engineering, SEA',
    text: 'As an engineering student, finding relevant past papers was always a challenge. Okoa Sem organized everything by department and year. The study groups feature helped me connect with classmates, and we aced our thermodynamics exam together!',
    date: '3 weeks ago',
  },
  {
    name: 'Mary Wanjiru',
    initials: 'MW',
    school: 'Nursing, SON',
    text: 'The AI chatbot is incredible! I asked questions about pharmacology at 2 AM and got detailed explanations instantly. The offline download feature means I can study anywhere, even without internet. Best KSh 100 I\'ve ever spent!',
    date: '5 days ago',
  },
  {
    name: 'Brian Njuguna',
    initials: 'BN',
    school: 'Mathematics, SPAS',
    text: 'I love how comprehensive the database is! Found papers dating back 5 years for Calculus III. The topic search helped me practice specific problem types. Passed my exam with an A. Thank you Okoa Sem team!',
    date: '1 week ago',
  },
  {
    name: 'Grace Wambui',
    initials: 'GW',
    school: 'Education, SED',
    text: 'Simple, affordable, and effective! The M-Pesa payment is so convenient. I can access everything from my phone. The platform is user-friendly and has everything I need for exam prep. All my classmates are now using it!',
    date: '2 days ago',
  },
]

export default function TestimonialsSection() {
  const [isLight, setIsLight] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

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

  // Theme-aware styles
  const getSectionStyle = (): React.CSSProperties => ({
    background: isLight 
      ? '#E8F5E9' 
      : '#1A1A1A',
  })

  const getHeaderStyle = (): React.CSSProperties => ({
    color: isLight ? '#1F2937' : '#FFFFFF',
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
    padding: '40px',
    transition: 'all 0.4s ease',
    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
    boxShadow: isHovered 
      ? (isLight 
          ? '0 20px 40px rgba(16, 216, 69, 0.15)' 
          : '0 20px 40px rgba(16, 216, 69, 0.2)')
      : 'none',
  })

  const getAvatarStyle = (): React.CSSProperties => ({
    // Use primary app green for avatars and white initials for contrast
    background: 'linear-gradient(135deg, #00D666, #00B355)',
    color: '#FFFFFF',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.125rem',
    fontWeight: 700,
    flexShrink: 0,
  })

  const getNameStyle = (): React.CSSProperties => ({
    color: isLight ? '#1F2937' : '#FFFFFF',
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '2px',
  })

  const getSchoolStyle = (): React.CSSProperties => ({
    color: isLight ? '#6B7280' : '#A0A0A0',
    fontSize: '0.875rem',
  })

  const getTextStyle = (): React.CSSProperties => ({
    color: isLight ? '#374151' : '#E5E5E5',
    fontSize: '0.95rem',
    lineHeight: 1.7,
  })

  const getDividerStyle = (): React.CSSProperties => ({
    borderTop: isLight ? '1px solid #E5E7EB' : '1px solid #2A2A2A',
    paddingTop: '16px',
  })

  const getDateStyle = (): React.CSSProperties => ({
    color: isLight ? '#9CA3AF' : '#A0A0A0',
    fontSize: '0.875rem',
  })

  return (
    <section 
      id="testimonials" 
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
            What Students Are Saying
          </h2>
          <p 
            className="text-xl"
            style={getSubtitleStyle()}
          >
            Join thousands of students who have transformed their exam preparation
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="relative overflow-hidden"
              style={getCardStyle(hoveredIndex === index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Testimonial Header */}
              <div className="relative z-10 flex items-center gap-4 mb-6">
                <div style={getAvatarStyle()}>
                  {testimonial.initials}
                </div>
                <div>
                  <h4 style={getNameStyle()}>{testimonial.name}</h4>
                  <span style={getSchoolStyle()}>{testimonial.school}</span>
                </div>
              </div>

              {/* Testimonial Text */}
              <div className="relative z-10 mb-6">
                <p style={getTextStyle()}>
                  "{testimonial.text}"
                </p>
              </div>

              {/* Footer */}
              <div className="relative z-10" style={getDividerStyle()}>
                <span style={getDateStyle()}>{testimonial.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}