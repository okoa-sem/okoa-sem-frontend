'use client'

import Link from 'next/link'
import { ArrowLeft, User, Award, Menu, X } from 'lucide-react'
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
            <div className="w-10 h-10 md:w-11 md:h-11 bg-primary text-dark rounded-xl flex items-center justify-center font-bold text-lg">
              OS
            </div>
            <span>Okoa Sem</span>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          
          
          <Link
            href={ROUTES.MARKING_SCHEMES}
            className="w-10 h-10 md:w-11 md:h-11 bg-dark-card border-2 border-dark-lighter rounded-xl flex items-center justify-center text-text-gray hover:border-primary hover:text-primary transition-colors"
            title="Marking Schemes"
          >
            <Award className="w-5 h-5" />
          </Link>
          
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
