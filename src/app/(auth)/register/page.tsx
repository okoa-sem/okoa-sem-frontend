'use client'

import { useEffect } from 'react'
import Navigation from '@/shared/components/layout/Navigation/Navigation'
import RegisterFormPanel from '@/features/auth/components/RegisterFormPanel'

export default function RegisterPage() {
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
      <Navigation />

      {/* Main Content */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden px-4 pt-20 pb-8 bg-dark"
      >
        {/* Register Form */}
        <div className="w-full lg:w-auto lg:min-w-[450px] max-w-md bg-dark-card rounded-2xl p-6 border border-dark-lighter" style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 60px rgba(0, 200, 83, 0.15)' }}>
          <RegisterFormPanel />
        </div>
      </div>
    </div>
  )
}
