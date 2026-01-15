'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ArrowRight, Sparkles, BookOpen, Users, GraduationCap, FileText } from 'lucide-react'
import { ROUTES, PLATFORM_STATS } from '@/shared/constants'

const stats = [
  { 
    number: `${PLATFORM_STATS.TOTAL_PAPERS / 1000}k+`, 
    label: 'Past Papers',
    icon: FileText 
  },
  { 
    number: PLATFORM_STATS.TOTAL_SCHOOLS, 
    label: 'Schools',
    icon: GraduationCap 
  },
  { 
    number: `${PLATFORM_STATS.TOTAL_DEPARTMENTS}+`, 
    label: 'Departments',
    icon: BookOpen 
  },
  { 
    number: `${PLATFORM_STATS.TOTAL_STUDENTS / 1000}k+`, 
    label: 'Students',
    icon: Users 
  },
]

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    setMounted(true)
    
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = `${ROUTES.PAST_PAPERS}?q=${encodeURIComponent(searchQuery)}`
  }

  return (
    <section className="hero-section relative w-full min-h-screen overflow-hidden">
      {/* Background Image - Full coverage */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Students studying"
          fill
          priority
          className="object-cover object-center"
          quality={90}
        />
      </div>
      
      {/* Dark Theme Overlay */}
      <div 
        className="absolute inset-0 z-[1] transition-opacity duration-500"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(5, 5, 10, 0.9) 0%,
              rgba(5, 5, 10, 0.85) 50%,
              rgba(5, 5, 10, 0.9) 100%
            )
          `,
          opacity: isLight ? 0 : 1,
          pointerEvents: isLight ? 'none' : 'auto',
        }}
      />
      
      {/* Light Theme Overlay  */}
      <div 
        className="absolute inset-0 z-[1] transition-opacity duration-500"
        style={{ 
          background: `
            linear-gradient(
              135deg,
              rgba(184, 245, 205, 0.85) 0%,
              rgba(184, 245, 205, 0.75) 50%,
              rgba(184, 245, 205, 0.85) 100%
            )
          `,
          opacity: isLight ? 1 : 0,
          pointerEvents: isLight ? 'auto' : 'none',
        }} 
      />

      {/* Main Content Grid */}
      <div className="relative z-10 w-full min-h-screen flex flex-col overflow-hidden">
        
        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center pt-24 pb-16">
          <div className="w-full max-w-[80rem] mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center">
              {/* Left Content - Centered */}
              <div className="w-full max-w-4xl text-center">
                {/* Animated badges container */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                  {/* Tagline badge */}
                  <div 
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transform transition-all duration-700 ${
                      mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                    style={{
                      backgroundColor: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 200, 83, 0.15)',
                      border: isLight ? '1.5px solid rgba(0, 150, 60, 0.5)' : '1px solid rgba(0, 200, 83, 0.4)',
                    }}
                  >
                    <span className="text-sm font-semibold text-primary">Learn Faster, Study Smarter, Achieve More</span>
                  </div>

                  {/* Study Companion badge */}
                  <div 
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transform transition-all duration-700 ${
                      mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                    style={{
                      backgroundColor: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 200, 83, 0.15)',
                      border: isLight ? '1.5px solid rgba(0, 150, 60, 0.5)' : '1px solid rgba(0, 200, 83, 0.4)',
                    }}
                  >
                    <span className="text-sm font-semibold text-primary">Your Ultimate Study Companion</span>
                  </div>
                </div>

                {/* Main headline */}
                <h1 
                  className={`hero-title text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 tracking-tight leading-[1.2] transform transition-all duration-700 delay-100 ${
                    mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                >
                  <span className={`block ${isLight ? 'text-gray-900' : 'text-white'}`}>Never Miss An Exam</span>
                  <span className={`block ${isLight ? 'text-gray-900' : 'text-white'}`}>
                    <span className="text-primary">Question Pattern</span>
                  </span>
                  <span className="text-primary block">Again</span>
                </h1>

                {/* Subtitle */}
                <p 
                  className={`hero-subtitle text-lg md:text-xl mb-8 leading-relaxed transform transition-all duration-700 delay-200 ${
                    mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  } ${isLight ? 'text-gray-700' : 'text-gray-300'}`}
                >
                  Access thousands of past papers, AI-powered study tools, and collaborative 
                  learning features designed for students who want to excel.
                </p>

                {/* Search Bar */}
               
                
                {/* CTA Buttons */}
                <div 
                  className={`flex flex-wrap gap-4 justify-center transform transition-all duration-700 delay-400 ${
                    mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                >
                  <Link
                    href={ROUTES.PAST_PAPERS}
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark"
                  >
                    Browse Past Papers
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link 
                    href={ROUTES.CHATBOT} 
                    className={`inline-flex items-center justify-center px-6 py-3 font-semibold rounded-xl border-2 transition-all duration-300 hover:-translate-y-1 ${
                      isLight 
                        ? 'bg-white border-gray-300 text-gray-800 hover:border-primary hover:text-primary shadow-md' 
                        : 'bg-transparent border-gray-600 text-white hover:border-primary hover:text-primary'
                    }`}
                  >
                    Try AI Study Bot
                  </Link>
                  <Link 
                    href={ROUTES.YOUTUBE} 
                    className={`inline-flex items-center justify-center px-6 py-3 font-semibold rounded-xl border-2 transition-all duration-300 hover:-translate-y-1 ${
                      isLight 
                        ? 'bg-white border-gray-300 text-gray-800 hover:border-primary hover:text-primary shadow-md' 
                        : 'bg-transparent border-gray-600 text-white hover:border-primary hover:text-primary'
                    }`}
                  >
                    Study with YouTube
                  </Link>
                </div>

                {/* Quick stats */}
                <div 
                  className={`flex flex-col items-center gap-8 mt-10 pt-8 transform transition-all duration-700 delay-500 ${
                    mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  style={{
                    borderTop: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <div className="flex flex-wrap justify-center gap-8">
                    {stats.map((stat) => (
                      <div key={stat.label} className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                          <stat.icon className="w-5 h-5 text-primary" />
                          <div className={`text-2xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{stat.number}</div>
                        </div>
                        <div className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}