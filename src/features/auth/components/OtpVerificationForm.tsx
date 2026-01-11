'use client'

import { useState } from 'react'
import { KeyRound, ArrowRight, RefreshCw } from 'lucide-react'

interface OtpVerificationFormProps {
  email: string
  type: 'EMAIL_VERIFICATION' | 'LOGIN_2FA'
  onSubmit: (code: string) => Promise<void>
  onResend: () => Promise<void>
  isLoading?: boolean
}

export default function OtpVerificationForm({ 
  email, 
  type, 
  onSubmit, 
  onResend, 
  isLoading 
}: OtpVerificationFormProps) {
  const [code, setCode] = useState('')
  const [isResending, setIsResending] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length >= 4) onSubmit(code)
  }

  const handleResend = async () => {
    setIsResending(true)
    await onResend()
    setIsResending(false)
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
        <p className="text-sm text-primary-light text-center">
          We sent a code to <span className="font-semibold text-white">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-text-gray mb-1">
            Verification Code
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyRound className="h-4 w-4 text-text-gray" />
            </div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full pl-10 pr-3 py-2.5 bg-dark border border-[#2A2A2A] rounded-lg text-sm text-white placeholder-text-gray focus:outline-none focus:ring-2 focus:ring-primary transition-all tracking-widest"
              placeholder="123456"
              maxLength={6}
              disabled={isLoading}
              autoFocus
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || code.length < 4}
          className="w-full py-2.5 bg-primary text-white rounded-lg font-semibold text-sm transition-all hover:bg-primary-dark hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? 'Verifying...' : 'Verify & Continue'}
          {!isLoading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={handleResend}
          disabled={isResending || isLoading}
          className="text-xs text-text-gray hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto"
        >
          <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
          {isResending ? 'Resending...' : "Didn't receive the code? Resend"}
        </button>
      </div>
    </div>
  )
}