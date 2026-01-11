'use client'

import { useEffect } from 'react'
import Navigation from '@/shared/components/layout/Navigation/Navigation'
import LoginFormPanel from '@/features/auth/components/LoginFormPanel'

export default function LoginPage() {
  // Add class to body when page mounts
  useEffect(() => {
    document.body.classList.add('auth-page')

    return () => {
      document.body.classList.remove('auth-page')
    }
  }, [])

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Navigation */}


      {/* Main Content */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden px-4 pt-20 pb-8 bg-dark"
      >
        {/* Login Form */}
        <div className="w-full lg:w-auto lg:min-w-[450px] max-w-md bg-dark-card rounded-2xl shadow-2xl p-6 border border-dark-lighter">
          <LoginFormPanel />
        </div>
      </div>
    </div>
  )
}