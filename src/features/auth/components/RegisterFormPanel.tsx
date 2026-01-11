'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation' 
import { AlertCircle } from 'lucide-react'
import GoogleSignInButton from './GoogleSignInButton'
import EmailPasswordRegisterForm from './EmailPasswordRegisterForm'
import OtpVerificationForm from './OtpVerificationForm'
import { register, verifyEmail, resendOtp } from '@/features/auth/services/authService'

type AuthStep = 'DETAILS' | 'OTP'

export default function RegisterFormPanel() {
  const router = useRouter()
  const [step, setStep] = useState<AuthStep>('DETAILS')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Temporary state to hold data between steps
  const [tempEmail, setTempEmail] = useState('')

  // Step 1: Handle Initial Registration
  const handleRegister = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      // 1. Register user -> triggers OTP email
      await register({ displayName: name, email, password })
      
      // 2. Move to OTP step
      setTempEmail(email)
      setStep('OTP')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Handle OTP Verification
  const handleVerifyOtp = async (code: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await verifyEmail({
        email: tempEmail,
        code,
        type: 'EMAIL_VERIFICATION'
      })
      
      alert('Account verified! Please log in.')
      router.push('/login')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await resendOtp({ email: tempEmail, type: 'EMAIL_VERIFICATION' })
      alert('Code resent successfully')
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <div className="w-full flex flex-col">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 font-display">
          {step === 'DETAILS' ? 'Create Account' : 'Verify Email'}
        </h1>
        <p className="text-text-gray text-sm leading-relaxed">
          {step === 'DETAILS' 
            ? 'Join thousands of students and start learning today'
            : 'Please enter the verification code sent to your email'}
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-500 text-xs leading-relaxed">{error}</p>
        </div>
      )}

      {step === 'DETAILS' ? (
        <>
          <div className="mb-4">
            <EmailPasswordRegisterForm onSubmit={handleRegister} isLoading={isLoading} />
          </div>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2A2A2A]"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-dark text-text-gray text-xs font-medium">or sign up with</span>
            </div>
          </div>

          <div className="mb-5">
            <GoogleSignInButton onClick={() => alert('Coming soon')} isLoading={isLoading} />
          </div>

          <div className="text-center mb-4 pt-1">
            <p className="text-text-gray text-xs">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:text-primary-light transition-colors font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </>
      ) : (
        <OtpVerificationForm 
          email={tempEmail}
          type="EMAIL_VERIFICATION"
          onSubmit={handleVerifyOtp}
          onResend={handleResend}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}