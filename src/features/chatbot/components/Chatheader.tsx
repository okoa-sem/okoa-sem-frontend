'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, Home, FileText, Youtube, User, ChevronDown, X, Award } from 'lucide-react'
import ThemeToggle from '@/shared/components/ThemeToggle'
import { ROUTES } from '@/shared/constants'

interface ChatHeaderProps {
  onToggleSidebar: () => void
  isSidebarOpen: boolean
}

const quickLinks = [
  { href: ROUTES.HOME, label: 'Home', icon: Home },
  { href: ROUTES.PAST_PAPERS, label: 'Past Papers', icon: FileText },
  { href: ROUTES.MARKING_SCHEMES, label: 'Mark Schemes', icon: Award },
  { href: ROUTES.YOUTUBE, label: 'YouTube', icon: Youtube },
  { href: ROUTES.MY_ACCOUNT, label: 'Account', icon: User },
]

export default function ChatHeader({ onToggleSidebar, isSidebarOpen }: ChatHeaderProps) {
  const [isLight, setIsLight] = useState(false)
  const [showNavDropdown, setShowNavDropdown] = useState(false)

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

  const getHeaderStyle = (): React.CSSProperties => ({
    backgroundColor: isLight ? '#FFFFFF' : '#0F0F12',
    borderBottom: isLight ? '1px solid #E5E7EB' : '1px solid #2A2A2A',
  })

  return (
    <header 
      className="sticky top-0 z-50 px-4 py-3 flex-shrink-0"
      style={getHeaderStyle()}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left Section - Sidebar Toggle & Logo */}
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
              isLight 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300' 
                : 'bg-dark-card text-white hover:bg-dark-lighter active:bg-dark-elevated'
            } ${isSidebarOpen ? 'bg-primary/20 text-primary' : ''}`}
            aria-label={isSidebarOpen ? 'Close chat history' : 'Open chat history'}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo - Links to Home */}
          <Link 
            href={ROUTES.HOME} 
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center font-bold text-dark text-sm group-hover:scale-105 transition-transform">
              OS
            </div>
            <span className={`font-semibold text-lg hidden sm:block ${isLight ? 'text-gray-900' : 'text-white'}`}>
              Okoa Sem
            </span>
          </Link>
        </div>

        {/* Center - Page Title (Mobile) */}
        <div className="flex-1 text-center sm:hidden">
          <span className={`text-sm font-medium ${isLight ? 'text-gray-600' : 'text-text-gray'}`}>
            AI Study Bot
          </span>
        </div>

        {/* Right Section - Quick Navigation */}
        <div className="flex items-center gap-2">
          {/* Desktop Quick Links */}
          <div className="hidden md:flex items-center gap-1">
            {quickLinks.slice(0, 3).map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isLight 
                      ? 'text-gray-600 hover:text-primary hover:bg-gray-100' 
                      : 'text-text-gray hover:text-white hover:bg-dark-lighter'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Mobile Navigation Dropdown */}
          <div className="relative md:hidden">
            <button
              onClick={() => setShowNavDropdown(!showNavDropdown)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isLight 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-dark-card text-white hover:bg-dark-lighter'
              }`}
            >
              <span>Navigate</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showNavDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showNavDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNavDropdown(false)}
                />
                <div 
                  className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-xl z-50 overflow-hidden ${
                    isLight 
                      ? 'bg-white border border-gray-200' 
                      : 'bg-dark-card border border-dark-lighter'
                  }`}
                >
                  {quickLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setShowNavDropdown(false)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                          isLight 
                            ? 'text-gray-700 hover:bg-gray-100 hover:text-primary' 
                            : 'text-white hover:bg-dark-lighter hover:text-primary'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{link.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Account Button - Desktop */}
          <Link
            href={ROUTES.MY_ACCOUNT}
            className={`hidden md:flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${
              isLight 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-primary' 
                : 'bg-dark-card text-text-gray hover:bg-dark-lighter hover:text-primary'
            }`}
            title="My Account"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}