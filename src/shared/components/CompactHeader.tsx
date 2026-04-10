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
    <nav className="bg-dark border-b border-dark-lighter px-4 md:px-[5%] py-4 flex-shrink-0">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-dark-card text-white hover:bg-dark-lighter active:bg-dark-elevated transition-all border border-dark-lighter"
              aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 text-primary font-bold text-xl md:text-2xl">
            <Image 
              src="/okoa-logo.png"
              alt="Okoa Sem Logo" 
              width={45} 
              height={45}
              className="hover:scale-105 transition-transform"
            />
            <span>Okoa Sem</span>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Quick Access Buttons - Hidden on mobile, shown on md and up */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href={ROUTES.PAST_PAPERS}
              className="px-4 py-2 rounded-lg bg-dark-card border border-dark-lighter text-text-gray hover:border-primary hover:text-primary hover:bg-primary/5 transition-all font-medium text-sm flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Papers
            </Link>
            
            <Link
              href={ROUTES.CHATBOT}
              className="px-4 py-2 rounded-lg bg-dark-card border border-dark-lighter text-text-gray hover:border-primary hover:text-primary hover:bg-primary/5 transition-all font-medium text-sm flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              AI
            </Link>
            
            <Link
              href={ROUTES.MARKING_SCHEMES}
              className="px-4 py-2 rounded-lg bg-dark-card border border-dark-lighter text-text-gray hover:border-primary hover:text-primary hover:bg-primary/5 transition-all font-medium text-sm flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              Schemes
            </Link>
            
            <Link
              href={ROUTES.YOUTUBE}
              className="px-4 py-2 rounded-lg bg-dark-card border border-dark-lighter text-text-gray hover:border-primary hover:text-primary hover:bg-primary/5 transition-all font-medium text-sm flex items-center gap-2"
            >
              <Youtube className="w-4 h-4" />
              Video
            </Link>
          </div>
          
          {/* Mobile Icon Buttons - Shown on mobile, hidden on md and up */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href={ROUTES.PAST_PAPERS}
              className="w-10 h-10 bg-dark-card border border-dark-lighter rounded-lg flex items-center justify-center text-text-gray hover:border-primary hover:text-primary transition-all"
              title="Past Papers"
            >
              <BookOpen className="w-5 h-5" />
            </Link>
            
            <Link
              href={ROUTES.CHATBOT}
              className="w-10 h-10 bg-dark-card border border-dark-lighter rounded-lg flex items-center justify-center text-text-gray hover:border-primary hover:text-primary transition-all"
              title="AI Study Bot"
            >
              <Brain className="w-5 h-5" />
            </Link>
            
            <Link
              href={ROUTES.MARKING_SCHEMES}
              className="w-10 h-10 bg-dark-card border border-dark-lighter rounded-lg flex items-center justify-center text-text-gray hover:border-primary hover:text-primary transition-all"
              title="Marking Schemes"
            >
              <Award className="w-5 h-5" />
            </Link>
            
            <Link
              href={ROUTES.YOUTUBE}
              className="w-10 h-10 bg-dark-card border border-dark-lighter rounded-lg flex items-center justify-center text-text-gray hover:border-primary hover:text-primary transition-all"
              title="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </Link>
          </div>
          
          <Link
            href={ROUTES.MY_ACCOUNT}
            className="w-10 h-10 md:w-11 md:h-11 bg-dark-card border-2 border-dark-lighter rounded-xl flex items-center justify-center text-text-gray hover:border-primary hover:text-primary transition-colors"
            title="My Account"
          >
            <User className="w-5 h-5" />
          </Link>

          {showBackButton && (
            <Link 
              href={backHref}
              className="hidden sm:flex items-center gap-2 px-4 py-2 border-2 border-dark-lighter rounded-lg text-white font-semibold hover:border-primary hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{backLabel}</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
