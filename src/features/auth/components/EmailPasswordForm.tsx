'use client'

import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'

interface EmailPasswordFormProps {
  onSubmit: (email: string, password: string) => Promise<void>
  isLoading?: boolean
}

export default function EmailPasswordForm({ onSubmit, isLoading = false }: EmailPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(email, password)
    } catch (error) {
      // Error handling is done in the parent component
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-xs font-medium text-text-gray mb-1">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-4 w-4 text-text-gray" />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors({ ...errors, email: undefined })
            }}
            className={`w-full pl-10 pr-3 py-2.5 bg-dark border rounded-lg text-sm text-white placeholder-text-gray focus:outline-none focus:ring-2 focus:ring-primary transition-all h-[40px] ${errors.email ? 'border-red-500' : 'border-[#2A2A2A]'
              }`}
            placeholder="your.email@example.com"
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.email}</span>
          </div>
        )}
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password" className="block text-xs font-medium text-text-gray mb-1">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 text-text-gray" />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors({ ...errors, password: undefined })
            }}
            className={`w-full pl-10 pr-10 py-2.5 bg-dark border h-[40px] rounded-lg text-sm text-white placeholder-text-gray focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.password ? 'border-red-500' : 'border-[#2A2A2A]'
              }`}
            placeholder="Enter your password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-gray hover:text-white transition-colors"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.password}</span>
          </div>
        )}
      </div>

      {/* Forgot Password Link */}
      <div className="text-right pt-1">
        <a
          href="#"
          className="text-xs text-primary hover:text-primary-dark transition-colors"
          onClick={(e) => {
            e.preventDefault()
            alert('Password reset functionality would be implemented here')
          }}
        >
          Forgot password?
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 bg-primary text-white rounded-lg font-semibold text-sm transition-all hover:bg-primary-dark hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}
