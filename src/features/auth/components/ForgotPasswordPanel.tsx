'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowLeft, Mail, RefreshCw, KeyRound, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { forgotPassword, resetPassword, resendOtp } from '@/features/auth/services/authService'

type ForgotPasswordStep = 'EMAIL' | 'OTP' | 'NEW_PASSWORD' | 'SUCCESS'

export default function ForgotPasswordPanel() {
  const router = useRouter()
  const [step, setStep] = useState<ForgotPasswordStep>('EMAIL')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Data
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isResending, setIsResending] = useState(false)

  // Step 1: Request Password Reset
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setError(null)
    try {
      await forgotPassword({ email })
      setStep('OTP')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Verify Code 
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length < 4) return
    setStep('NEW_PASSWORD')
  }

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword || newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      await resetPassword({ email, code, newPassword })
      setStep('SUCCESS')
    } catch (error: any) {
      setError(error.message)
      // If code is invalid, maybe go back to OTP?
      if (error.message.toLowerCase().includes('code')) {
        setStep('OTP')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    try {
        // Use proper resend type
        await resendOtp({ email, type: 'PASSWORD_RESET' })
    } catch (error) {
    
    } finally {
        setIsResending(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {step === 'EMAIL' && 'Forgot Password?'}
          {step === 'OTP' && 'Check Your Email'}
          {step === 'NEW_PASSWORD' && 'Set New Password'}
          {step === 'SUCCESS' && 'Password Reset'}
        </h1>
        <p className="text-sm text-text-gray">
          {step === 'EMAIL' && 'Enter your email to receive a reset code'}
          {step === 'OTP' && `We sent a code to ${email}`}
          {step === 'NEW_PASSWORD' && 'Create a strong password for your account'}
          {step === 'SUCCESS' && 'Your password has been updated successfully'}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-sm text-red-400 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Email Form */}
      {step === 'EMAIL' && (
        <form onSubmit={handleRequestReset} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-gray mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-text-gray" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-dark border border-[#2A2A2A] rounded-lg text-sm text-white placeholder-text-gray focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="your.email@example.com"
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full py-2.5 bg-primary text-white rounded-lg font-semibold text-sm transition-all hover:bg-primary-dark hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? 'Sending Code...' : 'Send Reset Code'}
          </button>

          <Link 
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-text-gray hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </form>
      )}

      {/* Step 2: OTP Form */}
      {step === 'OTP' && (
        <div className="space-y-4">
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-gray mb-1">
                Enter Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-4 w-4 text-text-gray" />
                </div>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full pl-10 pr-3 py-2.5 bg-dark border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all tracking-widest"
                  placeholder="123456"
                  maxLength={6}
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={code.length < 4}
              className="w-full py-2.5 bg-primary text-white rounded-lg font-semibold text-sm transition-all hover:bg-primary-dark hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify Code
            </button>
          </form>

          <div className="text-center space-y-2">
            <button
              onClick={handleResendCode}
              disabled={isResending}
              className="text-xs text-text-gray hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
              {isResending ? 'Resending...' : "Didn't receive code? Resend"}
            </button>
            <button
                onClick={() => setStep('EMAIL')}
                className="text-xs text-text-gray hover:text-white transition-colors block mx-auto"
            >
                Change Email
            </button>
          </div>
        </div>
      )}

      {/* Step 3: New Password Form */}
      {step === 'NEW_PASSWORD' && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-gray mb-1">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-text-gray" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-dark border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="New password"
                minLength={6}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-gray hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-gray mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-text-gray" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-10 pr-3 py-2.5 bg-dark border rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  confirmPassword && newPassword !== confirmPassword ? 'border-red-500' : 'border-[#2A2A2A]'
                }`}
                placeholder="Confirm password"
                disabled={isLoading}
              />
            </div>
             {confirmPassword && newPassword !== confirmPassword && (
                 <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
             )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !newPassword || newPassword !== confirmPassword}
            className="w-full py-2.5 bg-primary text-white rounded-lg font-semibold text-sm transition-all hover:bg-primary-dark hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
           {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      {/* Step 4: Success */}
      {step === 'SUCCESS' && (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">All Done!</h3>
            <p className="text-sm text-text-gray">
              Your password has been successfully reset. You can now login with your new password.
            </p>
          </div>

          <Link
            href="/login"
            className="block w-full py-2.5 bg-primary text-white rounded-lg font-semibold text-sm transition-all hover:bg-primary-dark hover:shadow-lg text-center"
          >
            Continue to Login
          </Link>
        </div>
      )}
    </div>
  )
}
