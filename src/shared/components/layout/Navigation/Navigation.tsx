'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, User, ChevronDown } from 'lucide-react'
import ThemeToggle from '@/shared/components/ThemeToggle'
import { ROUTES } from '@/shared/constants'

const navLinks = [
  { href: ROUTES.PAST_PAPERS, label: 'Past Papers' },
  { href: ROUTES.CHATBOT, label: 'AI Study Bot' },
  { href: ROUTES.YOUTUBE, label: 'YouTube' },
  { href: '/#pricing', label: 'Pricing' },
]

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLight, setIsLight] = useState(false)
  const pathname = usePathname()
  
  const isHomePage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  const getNavBackground = () => {
    if (isLight) {
      return 'bg-white border-b border-gray-100 shadow-sm'
    }
    
    if (isHomePage && !isScrolled && !isMobileMenuOpen) {
      return 'bg-transparent'
    }
    
    return 'bg-dark/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${getNavBackground()}`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link href={ROUTES.HOME} className="flex items-center gap-2.5 group z-[101]">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center font-bold text-dark text-sm group-hover:scale-105 transition-transform">
                OS
              </div>
              <span className={`font-semibold text-lg hidden sm:block ${isLight ? 'text-gray-900' : 'text-white'}`}>
                Okoa Sem
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 group ${
                    isLight 
                      ? 'text-gray-700 hover:text-primary' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Theme toggle */}
              <div className="hidden sm:inline-flex">
                <ThemeToggle />
              </div>

              {/* Login Button */}
              <Link
                href={ROUTES.LOGIN}
                className={`hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all duration-200 rounded-lg ${
                  isLight 
                    ? 'bg-white text-primary border-2 border-primary hover:bg-primary/5 shadow-sm' 
                    : 'bg-dark-card text-primary border-2 border-primary/50 hover:border-primary hover:bg-primary/5 shadow-lg shadow-primary/10'
                }`}
              >
                Login
              </Link>

              {/* Sign Up CTA */}
              <Link
                href={ROUTES.SIGNUP}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-dark rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
              >
                Register
              </Link>

              {/* Account link - On far right */}
              <Link
                href={ROUTES.MY_ACCOUNT}
                className={`hidden sm:flex items-center gap-2 px-3 py-2 text-sm transition-colors ml-2 ${
                  isLight 
                    ? 'text-gray-700 hover:text-primary' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="hidden lg:inline">Account</span>
              </Link>

              {/* Mobile Menu Button - Improved touch target */}
              <button
                type="button"
                onClick={toggleMobileMenu}
                className={`md:hidden relative z-[101] flex items-center justify-center w-11 h-11 -mr-2 rounded-lg transition-colors active:scale-95 ${
                  isLight 
                    ? 'text-gray-700 hover:text-primary hover:bg-gray-100 active:bg-gray-200' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10 active:bg-white/20'
                }`}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Separate from nav for better z-index control */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 z-[90] bg-black/50"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          
          {/* Menu Content */}
          <div 
            className={`md:hidden fixed inset-x-0 top-16 bottom-0 z-[95] overflow-y-auto animate-fadeIn ${
              isLight ? 'bg-white' : 'bg-dark'
            }`}
          >
            <div className="container-custom py-6">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center justify-between px-4 py-4 rounded-xl text-lg font-medium transition-colors animate-fadeInUp ${
                      isLight 
                        ? 'text-gray-900 hover:bg-gray-100 active:bg-gray-200' 
                        : 'text-white hover:bg-white/5 active:bg-white/10'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {link.label}
                    <ChevronDown className={`w-5 h-5 -rotate-90 ${isLight ? 'text-gray-400' : 'text-gray-500'}`} />
                  </Link>
                ))}
              </nav>

              {/* Mobile CTAs */}
              <div 
                className="mt-6 pt-6 flex flex-col gap-3" 
                style={{ borderTop: isLight ? '1px solid #E5E7EB' : '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <ThemeToggle />
                </div>
                <Link
                  href={ROUTES.LOGIN}
                  onClick={closeMobileMenu}
                  className={`w-full py-4 rounded-xl font-semibold text-center border-2 transition-all animate-fadeInUp active:scale-[0.98] ${
                    isLight 
                      ? 'bg-white text-primary border-primary hover:bg-primary/5' 
                      : 'bg-dark-card text-primary border-primary/50 hover:border-primary hover:bg-primary/5'
                  }`}
                  style={{ animationDelay: '200ms' }}
                >
                  Login
                </Link>
                <Link
                  href={ROUTES.SIGNUP}
                  onClick={closeMobileMenu}
                  className="w-full py-4 bg-primary text-dark rounded-xl font-semibold text-center animate-fadeInUp active:scale-[0.98]"
                  style={{ animationDelay: '250ms' }}
                >
                  Register
                </Link>
                <Link
                  href={ROUTES.MY_ACCOUNT}
                  onClick={closeMobileMenu}
                  className={`w-full py-4 rounded-xl font-semibold text-center flex items-center justify-center gap-2 animate-fadeInUp active:scale-[0.98] ${
                    isLight 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'bg-white/5 text-white'
                  }`}
                  style={{ animationDelay: '300ms' }}
                >
                  <User className="w-5 h-5" />
                  My Account
                </Link>
              </div>

              {/* Mobile footer info */}
              <div className={`pt-8 text-center text-sm ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>
                <p>24,847 past papers • 8 universities</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}