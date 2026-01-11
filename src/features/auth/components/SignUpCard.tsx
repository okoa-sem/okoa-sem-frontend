'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Info, AlertCircle } from 'lucide-react'
import FeatureBadges from './FeatureBadges'
import GoogleSignInButton from './GoogleSignInButton'
import EmailPasswordForm from './EmailPasswordForm'
import { login } from '@/features/auth/services/authService'

export default function SignUpCard() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailPasswordLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      // Call the login API
      const response = await login({ email, password })
      
      // This component seems to be a mix of login and signup logic.
      // The `login` service now triggers a 2FA flow and doesn't return tokens directly.
      // For now, I'll just log the response.
      // A proper implementation would navigate to an OTP/2FA screen.
      console.log('Login initiated, OTP sent:', response)
     
      alert('Login initiated! Please check your email for a 2FA code.\n\nIn a real application, you would be redirected to a verification page.')
      
     
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    try {
     
      console.log('Initiating Google Sign-In...')
    
      alert('Google Sign-In would be implemented here.\n\nIn a real application, this would:\n1. Open Google OAuth flow\n2. Authenticate the user\n3. Create/update user profile\n4. Redirect to dashboard')
    } catch (error: any) {
      console.error('Sign-in error:', error)
      setError(error.message || 'Google sign-in failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-dark-card border-2 border-[#2A2A2A] rounded-3xl p-8 md:p-8 max-w-[440px] w-full animate-fadeInUp shadow-2xl relative overflow-hidden">
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white mx-auto mb-3">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-1">
            <span className="text-primary">Welcome Back!</span>
          </h1>
          <p className="text-text-gray text-sm leading-relaxed">
            Sign in to continue your academic journey
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-500 text-xs leading-relaxed">{error}</p>
          </div>
        )}

        {/* Email/Password Form */}
        <EmailPasswordForm onSubmit={handleEmailPasswordLogin} isLoading={isLoading} />

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#2A2A2A]"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-dark-card text-text-gray">or continue with</span>
          </div>
        </div>

        {/* Google Sign In Button */}
        <GoogleSignInButton onClick={handleGoogleSignIn} isLoading={isLoading} />

        {/* Info Box - Compact */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex gap-2 mb-5 text-xs">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-text-gray leading-snug">
            New to Okoa SEM?{' '}
            <Link href="/register" className="text-primary hover:text-primary-dark transition-colors font-semibold">
              Create an account
            </Link>
          </p>
        </div>

        {/* Feature Badges - Compact */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          <FeatureBadges />
        </div>

        {/* Terms - Compact */}
        <div className="text-center text-text-gray text-xs leading-relaxed mb-4">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="text-primary hover:text-primary-dark transition-colors">
            Terms
          </Link>
          {' & '}
          <Link href="/privacy" className="text-primary hover:text-primary-dark transition-colors">
            Privacy
          </Link>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-text-gray hover:text-primary transition-colors text-xs"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
