'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, User, Award, Menu, X, BookOpen, Brain, Youtube } from 'lucide-react'
import { ROUTES } from '@/shared/constants'
import ThemeToggle from './ThemeToggle'

interface CompactHeaderProps {
  showBackButton?: boolean
  backHref?: string
  backLabel?: string
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
}

export default function CompactHeader({ 
  showBackButton = true, 
  backHref = '/',
  backLabel = 'Back to Home',
  onToggleSidebar,
  isSidebarOpen = false
}: CompactHeaderProps) {
  return (
    <nav className="bg-dark border-b border-dark-lighter px-2 sm:px-4 md:px-[5%] py-0 flex-shrink-0 h-16 md:h-18">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center gap-2 sm:gap-3 h-full">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-dark-card text-white hover:bg-dark-lighter active:bg-dark-elevated transition-all border border-dark-lighter"
              aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            >
              {isSidebarOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          )}

          {/* Logo */}
          <Link href="/" className="flex items-center gap-0 text-primary font-bold text-lg sm:text-xl md:text-2xl mt-4 truncate">
            <Image 
              src="/okoa-logo.png"
              alt="Okoa Sem Logo"
              width={70}
              height={70}
              className="hover:scale-105 transition-transform flex-shrink-0 w-12 h-12 sm:w-auto sm:h-auto"
              style={{ mixBlendMode: 'screen' }}
            />
            <span className="-ml-2 sm:-ml-3 md:-ml-6">Okoa Sem</span>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
          {/* Quick Access Buttons - Hidden on mobile, shown on md and up */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href={ROUTES.PAST_PAPERS}
              className="px-3 sm:px-4 py-2 rounded-lg bg-dark-card border border-dark-lighter text-text-gray hover:border-primary hover:text-primary hover:bg-primary/5 transition-all font-medium text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4" />
              Papers
            </Link>
            
            <Link
              href={ROUTES.CHATBOT}
              className="px-3 sm:px-4 py-2 rounded-lg bg-dark-card border border-dark-lighter text-text-gray hover:border-primary hover:text-primary hover:bg-primary/5 transition-all font-medium text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap"
            >
              <Brain className="w-4 h-4" />
              AI
            </Link>
            
            <Link
              href={ROUTES.MARKING_SCHEMES}
              className="px-3 sm:px-4 py-2 rounded-lg bg-dark-card border border-dark-lighter text-text-gray hover:border-primary hover:text-primary hover:bg-primary/5 transition-all font-medium text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap"
            >
              <Award className="w-4 h-4" />
              Schemes
            </Link>
            
            <Link
              href={ROUTES.YOUTUBE}
              className="px-3 sm:px-4 py-2 rounded-lg bg-dark-card border border-dark-lighter text-text-gray hover:border-primary hover:text-primary hover:bg-primary/5 transition-all font-medium text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap"
            >
              <Youtube className="w-4 h-4" />
              Video
            </Link>
          </div>
          
          {/* Mobile Icon Buttons - Shown on mobile, hidden on md and up */}
          <div className="flex md:hidden items-center gap-1 sm:gap-2">
            <Link
              href={ROUTES.PAST_PAPERS}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-dark-card border border-dark-lighter rounded-lg flex items-center justify-center text-text-gray hover:border-primary hover:text-primary transition-all flex-shrink-0"
              title="Past Papers"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            
            <Link
              href={ROUTES.CHATBOT}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-dark-card border border-dark-lighter rounded-lg flex items-center justify-center text-text-gray hover:border-primary hover:text-primary transition-all flex-shrink-0"
              title="AI Study Bot"
            >
              <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            
            <Link
              href={ROUTES.MARKING_SCHEMES}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-dark-card border border-dark-lighter rounded-lg flex items-center justify-center text-text-gray hover:border-primary hover:text-primary transition-all flex-shrink-0"
              title="Marking Schemes"
            >
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            
            <Link
              href={ROUTES.YOUTUBE}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-dark-card border border-dark-lighter rounded-lg flex items-center justify-center text-text-gray hover:border-primary hover:text-primary transition-all flex-shrink-0"
              title="YouTube"
            >
              <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
          
          <Link
            href={ROUTES.MY_ACCOUNT}
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-dark-card border-2 border-dark-lighter rounded-xl flex items-center justify-center text-text-gray hover:border-primary hover:text-primary transition-colors flex-shrink-0"
            title="My Account"
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>

          {showBackButton && (
            <Link 
              href={backHref}
              className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 border-2 border-dark-lighter rounded-lg text-white font-semibold hover:border-primary hover:text-primary transition-colors whitespace-nowrap text-xs sm:text-sm"
            >
              <ArrowLeft className="w-4 h-4 flex-shrink-0" />
              <span>{backLabel}</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
