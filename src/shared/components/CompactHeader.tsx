'use client'

import Link from 'next/link'
import { ArrowLeft, User, Award } from 'lucide-react'
import { ROUTES } from '@/shared/constants'
import ThemeToggle from './ThemeToggle'

interface CompactHeaderProps {
  showBackButton?: boolean
  backHref?: string
  backLabel?: string
}

export default function CompactHeader({ 
  showBackButton = true, 
  backHref = '/',
  backLabel = 'Back to Home'
}: CompactHeaderProps) {
  return (
    <nav className="bg-dark border-b border-dark-lighter px-4 md:px-[5%] py-4 flex-shrink-0">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 text-primary font-bold text-xl md:text-2xl">
          <div className="w-10 h-10 md:w-11 md:h-11 bg-primary text-dark rounded-xl flex items-center justify-center font-bold text-lg">
            OS
          </div>
          <span>Okoa Sem</span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          
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
