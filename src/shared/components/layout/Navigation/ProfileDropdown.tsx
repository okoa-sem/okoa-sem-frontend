'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, User, LogOut } from 'lucide-react'
import { useAuth } from '@/app/providers/authentication-provider/AuthenticationProvider'

export default function ProfileDropdown() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    const checkTheme = () => {
      setIsLight(document.body.classList.contains('light-theme'))
    }
    checkTheme()
    const observer = new MutationObserver(() => checkTheme())
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  if (!user) return null

  const buttonClasses = `flex items-center gap-2 p-1.5 rounded-lg transition-colors ${
    isLight 
      ? 'hover:bg-gray-100' 
      : 'hover:bg-white/10'
  }`

  const dropdownClasses = `absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-50 transition-all duration-200 origin-top-right ${
    isLight
      ? 'bg-white border border-gray-200'
      : 'bg-dark-card border border-white/10'
  } ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`

  const itemClasses = `flex items-center w-full px-3 py-2.5 text-sm transition-colors ${
    isLight
      ? 'text-gray-700 hover:bg-gray-100'
      : 'text-gray-300 hover:bg-white/5'
  }`

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
      >
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-dark font-semibold">
          {user.displayName?.[0].toUpperCase()}
        </div>
        <span className={`hidden md:block text-sm font-medium ${isLight ? 'text-gray-800' : 'text-white'}`}>
          {user.displayName}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''} ${isLight ? 'text-gray-600' : 'text-gray-400'}`} />
      </button>

      <div className={dropdownClasses}>
        <div className="py-1">
          <Link href="/profile" className={itemClasses} onClick={() => setIsOpen(false)}>
            <User className="w-4 h-4 mr-3" />
            <span>Profile</span>
          </Link>
          <button
            onClick={() => {
              logout()
              setIsOpen(false)
            }}
            className={itemClasses}
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
