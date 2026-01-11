'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
    const initialTheme = savedTheme || 'dark'
    
    setTheme(initialTheme)
    applyTheme(initialTheme)
    setMounted(true)
  }, [])

  const applyTheme = (newTheme: 'dark' | 'light') => {
    const html = document.documentElement
    const body = document.body
    
    if (newTheme === 'light') {
      body.classList.add('light-theme')
      html.style.colorScheme = 'light'
    } else {
      body.classList.remove('light-theme')
      html.style.colorScheme = 'dark'
    }
    
    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-11 h-11 rounded-xl bg-dark-card border-2 border-dark-lighter hover:border-primary transition-all hover:text-primary"
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-slate-600" />
      )}
    </button>
  )
}
