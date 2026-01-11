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
              105deg,
              rgba(0, 0, 0, 0.92) 0%,
              rgba(0, 0, 0, 0.85) 40%,
              rgba(0, 0, 0, 0.6) 60%,
              rgba(0, 0, 0, 0.3) 80%,
              rgba(0, 0, 0, 0.15) 100%
            )
          `,
          opacity: isLight ? 0 : 1,
          pointerEvents: isLight ? 'none' : 'auto',
        }}
      />
      
      {/* Light Theme Overlay - Solid mint green on left, fading to transparent */}
      <div 
        className="absolute inset-0 z-[1] transition-opacity duration-500"
        style={{ 
          background: `
            linear-gradient(
              to right,
              #B8F5CD 0%,
              #B8F5CD 20%,
              rgba(184, 245, 205, 0.95) 30%,
              rgba(184, 245, 205, 0.7) 40%,
              rgba(184, 245, 205, 0.4) 50%,
              rgba(184, 245, 205, 0.1) 60%,
              transparent 80%
            )
          `,
          opacity: isLight ? 1 : 0,
          pointerEvents: isLight ? 'auto' : 'none',
        }} 
      />

      {/* Main Content Grid */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {/* Hero Content */}
        <div className="flex-1 flex items-center pt-24 pb-16">
          <div className="w-[90%] container-custom mx-auto">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              {/* Left Content */}
              <div className="lg:col-span-7 xl:col-span-6">
                {/* Animated badge */}
                <div 
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 transform transition-all duration-700 ${
                    mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  style={{
                    backgroundColor: isLight ? 'rgba(0, 200, 83, 0.2)' : 'rgba(0, 200, 83, 0.1)',
                    border: '1px solid rgba(0, 200, 83, 0.4)',
                  }}
                >
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-sm font-semibold text-primary">Your Ultimate Study Companion</span>
                </div>

                {/* Main headline */}
                <h1 
                  className={`hero-title text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1] transform transition-all duration-700 delay-100 ${
                    mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                >
                  <span className={`block ${isLight ? 'text-gray-900' : 'text-white'}`}>Never Miss An</span>
                  <span className={`block ${isLight ? 'text-gray-900' : 'text-white'}`}>Exam{' '}
                    <span className="text-primary">Question</span>
                  </span>
                  <span className="text-primary block">Pattern Again</span>
                </h1>

                {/* Subtitle */}
                <p 
                  className={`hero-subtitle text-lg md:text-xl mb-8 leading-relaxed max-w-xl transform transition-all duration-700 delay-200 ${
                    mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  } ${isLight ? 'text-gray-700' : 'text-gray-300'}`}
                >
                  Access thousands of past papers, AI-powered study tools, and collaborative 
                  learning features designed for students who want to excel.
                </p>

                {/* Search Bar */}
               
                
                {/* CTA Buttons */}
                <div 
                  className={`flex flex-wrap gap-4 transform transition-all duration-700 delay-400 ${
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
                  className={`hidden lg:flex items-center gap-8 mt-10 pt-8 transform transition-all duration-700 delay-500 ${
                    mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  style={{
                    borderTop: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {stats.slice(0, 3).map((stat) => (
                    <div key={stat.label} className="flex items-center gap-3">
                      <div>
                        <div className={`text-2xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{stat.number}</div>
                        <div className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side - Floating cards */}
              <div className="hidden lg:block lg:col-span-5 xl:col-span-6">
                <div className="relative h-[500px]">
                  <div 
                    className={`absolute top-10 right-20 rounded-2xl p-4 border shadow-2xl transform transition-all duration-1000 delay-600 ${
                      mounted ? 'translate-y-0 opacity-100 rotate-3' : 'translate-y-8 opacity-0'
                    } ${isLight ? 'bg-white/95 border-gray-200' : 'bg-white/10 backdrop-blur-md border-white/20'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className={`font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>24,000+</div>
                        <div className={`text-sm ${isLight ? 'text-gray-500' : 'text-white/60'}`}>Past Papers</div>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`absolute top-40 right-0 rounded-2xl p-4 border shadow-2xl transform transition-all duration-1000 delay-700 ${
                      mounted ? 'translate-y-0 opacity-100 -rotate-2' : 'translate-y-8 opacity-0'
                    } ${isLight ? 'bg-white/95 border-gray-200' : 'bg-white/10 backdrop-blur-md border-white/20'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-green-400/20 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <div className={`font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>AI Powered</div>
                        <div className={`text-sm ${isLight ? 'text-gray-500' : 'text-white/60'}`}>Study Assistant</div>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`absolute bottom-20 right-32 rounded-2xl p-4 border shadow-2xl transform transition-all duration-1000 delay-800 ${
                      mounted ? 'translate-y-0 opacity-100 rotate-1' : 'translate-y-8 opacity-0'
                    } ${isLight ? 'bg-white/95 border-gray-200' : 'bg-white/10 backdrop-blur-md border-white/20'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-400/20 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <div className={`font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>Study Groups</div>
                        <div className={`text-sm ${isLight ? 'text-gray-500' : 'text-white/60'}`}>Collaborate & Learn</div>
                      </div>
                    </div>
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