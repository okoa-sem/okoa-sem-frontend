'use client'

import { useEffect, Suspense } from 'react'
import ForgotPasswordPanel from '@/features/auth/components/ForgotPasswordPanel'

// Create a loading component
function ForgotPasswordLoading() {
  return (
    <div className="w-full h-[400px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  // Add class to body when page mounts
  useEffect(() => {
    document.body.classList.add('auth-page')

    return () => {
      document.body.classList.remove('auth-page')
    }
  }, [])

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Main Content */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden px-4 pt-20 pb-8 bg-dark"
      >
        {/* Forgot Password Flow */}
        <div className="w-full lg:w-auto lg:min-w-[450px] max-w-md bg-dark-card rounded-2xl shadow-2xl p-6 border border-dark-lighter">
          <Suspense fallback={<ForgotPasswordLoading />}>
            <ForgotPasswordPanel />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
