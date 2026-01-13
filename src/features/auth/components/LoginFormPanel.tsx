'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import GoogleSignInButton from './GoogleSignInButton'
import EmailPasswordForm from './EmailPasswordForm'
import OtpVerificationForm from './OtpVerificationForm'
import { login, verifyLogin2FA, resendOtp } from '@/features/auth/services/authService'
import { useAuth } from '@/app/providers/authentication-provider/AuthenticationProvider'

type LoginStep = 'CREDENTIALS' | '2FA'

export default function LoginFormPanel() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<LoginStep>('CREDENTIALS')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login: authLogin } = useAuth()
  const [tempEmail, setTempEmail] = useState('')

  // Step 1: Authenticate Credentials
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      // 1. Login -> triggers 2FA OTP
      await login({ email, password })
      
      // 2. Move to 2FA step
      setTempEmail(email)
      setStep('2FA')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Verify 2FA and Store Tokens
  const handleVerify2FA = async (code: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await verifyLogin2FA({
        email: tempEmail,
        code,
        type: 'LOGIN_2FA'
      })

      // 3. Store tokens and user data in context
      authLogin(response.user, response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)

      // 4. Redirect to the 'next' URL if it exists, otherwise to the homepage
      const nextParam = searchParams.get('next')
      const targetUrl = nextParam || '/'
      
      window.location.href = targetUrl
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await resendOtp({ email: tempEmail, type: 'LOGIN_2FA' })
      alert('2FA code resent')
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <div className="w-full flex flex-col">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 font-display">
          {step === 'CREDENTIALS' ? 'Welcome Back!' : 'Two-Factor Auth'}
        </h1>
        <p className="text-text-gray text-sm leading-relaxed">
          {step === 'CREDENTIALS'
            ? 'Sign in to your account to continue learning'
            : 'Enter the security code sent to your email'}
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-500 text-xs leading-relaxed">{error}</p>
        </div>
      )}

      {step === 'CREDENTIALS' ? (
        <>
          <div className="mb-4">
            <EmailPasswordForm onSubmit={handleLogin} isLoading={isLoading} />
          </div>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2A2A2A]"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-dark text-text-gray text-xs font-medium">or continue with</span>
            </div>
          </div>

          <div className="mb-5">
            <GoogleSignInButton onClick={() => alert('Coming soon')} isLoading={isLoading} />
          </div>

          <div className="text-center mb-4 pt-1">
            <p className="text-text-gray text-xs">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary hover:text-primary-light transition-colors font-semibold">
                Create one
              </Link>
            </p>
          </div>

         
        </>
      ) : (
        <OtpVerificationForm
          email={tempEmail}
          type="LOGIN_2FA"
          onSubmit={handleVerify2FA}
          onResend={handleResend}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}