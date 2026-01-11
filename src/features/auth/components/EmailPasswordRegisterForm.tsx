'use client'

import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, AlertCircle, User } from 'lucide-react'

interface EmailPasswordRegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => Promise<void>
  isLoading?: boolean
}

export default function EmailPasswordRegisterForm({ onSubmit, isLoading = false }: EmailPasswordRegisterFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{ 
    name?: string
    email?: string
    password?: string
    confirmPassword?: string 
  }>({})

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors: { 
      name?: string
      email?: string
      password?: string
      confirmPassword?: string 
    } = {}

    if (!name) {
      newErrors.name = 'Name is required'
    } else if (name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      await onSubmit(name, email, password)
    } catch (error) {
      // Error handling is done in the parent component
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Name Input */}
      <div>
        <label htmlFor="name" className="block text-xs font-medium text-text-gray mb-1">
          Full Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-4 w-4 text-text-gray" />
          </div>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (errors.name) setErrors({ ...errors, name: undefined })
            }}
            className={`w-full pl-10 pr-3 py-2.5 bg-dark border rounded-lg text-sm text-white placeholder-text-gray focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
              errors.name ? 'border-red-500' : 'border-[#2A2A2A]'
            }`}
            placeholder="John Doe"
            disabled={isLoading}
          />
        </div>
        {errors.name && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.name}</span>
          </div>
        )}
      </div>

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
            className={`w-full pl-10 pr-3 py-2.5 bg-dark border rounded-lg text-sm text-white placeholder-text-gray focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
              errors.email ? 'border-red-500' : 'border-[#2A2A2A]'
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
            className={`w-full pl-10 pr-10 py-2.5 bg-dark border rounded-lg text-sm text-white placeholder-text-gray focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
              errors.password ? 'border-red-500' : 'border-[#2A2A2A]'
            }`}
            placeholder="Min 8 chars, uppercase, number"
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

      {/* Confirm Password Input */}
      <div>
        <label htmlFor="confirmPassword" className="block text-xs font-medium text-text-gray mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 text-text-gray" />
          </div>
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined })
            }}
            className={`w-full pl-10 pr-10 py-2.5 bg-dark border rounded-lg text-sm text-white placeholder-text-gray focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
              errors.confirmPassword ? 'border-red-500' : 'border-[#2A2A2A]'
            }`}
            placeholder="Confirm your password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-gray hover:text-white transition-colors"
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.confirmPassword}</span>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 bg-primary text-white rounded-lg font-semibold text-sm transition-all hover:bg-primary-dark hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-4"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  )
}
