'use client'

import { useState, useEffect } from 'react'
import { FEATURES } from '@/shared/constants'

const colorClasses = {
  purple: {
    light: 'bg-purple-100',
    dark: 'bg-purple-500/15',
  },
  green: {
    light: 'bg-green-100',
    dark: 'bg-green-500/15',
  },
  pink: {
    light: 'bg-pink-100',
    dark: 'bg-pink-500/15',
  },
  blue: {
    light: 'bg-blue-100',
    dark: 'bg-blue-500/15',
  },
  orange: {
    light: 'bg-orange-100',
    dark: 'bg-orange-500/15',
  },
  cyan: {
    light: 'bg-cyan-100',
    dark: 'bg-cyan-500/15',
  },
}

export default function FeaturesSection() {
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

  return (
    <section 
      id="features" 
      className="py-20 md:py-28 transition-colors duration-300"
      style={{
        backgroundColor: isLight ? '#E8F9ED' : '#141414',
      }}
    >
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: isLight ? '#111827' : '#FFFFFF' }}
          >
            Everything You Need to Excel
          </h2>
          <p 
            className="text-xl"
            style={{ color: isLight ? '#4B5563' : '#9CA3AF' }}
          >
            Comprehensive tools designed to help you succeed in your academic journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => {
            const colors = colorClasses[feature.color as keyof typeof colorClasses]
            return (
              <div
                key={feature.title}
                className={`group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                  isLight 
                    ? 'bg-white border border-gray-100 hover:border-primary/30 hover:shadow-xl shadow-sm' 
                    : 'bg-[#1A1A1A] border border-[#2A2A2A] hover:border-primary/40'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-full h-1 rounded-full mb-6 ${
                    isLight ? colors.light : colors.dark
                  }`}
                />

                <h3 
                  className="text-xl md:text-2xl font-bold mb-3"
                  style={{ color: isLight ? '#111827' : '#FFFFFF' }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="leading-relaxed"
                  style={{ color: isLight ? '#4B5563' : '#9CA3AF' }}
                >
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}