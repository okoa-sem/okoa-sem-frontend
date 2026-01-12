'use client'

import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, AlertCircle, User, School, ChevronDown } from 'lucide-react'

interface EmailPasswordRegisterFormProps {
  onSubmit: (displayName: string, email: string, password: string, institution: string) => Promise<void>
  isLoading?: boolean
}

const institutions = [
  { value: '', label: 'Select your institution', disabled: true },
  { value: 'MERU_UNIVERSITY', label: 'Meru University of Science and Technology' },
  { value: 'UON', label: 'University of Nairobi' },
  { value: 'JKUAT', label: 'Jomo Kenyatta University of Agriculture and Technology' },
  { value: 'KU', label: 'Kenyatta University' },
  { value: 'TUK', label: 'Technical University of Kenya' },
]

export default function EmailPasswordRegisterForm({ onSubmit, isLoading = false }: EmailPasswordRegisterFormProps) {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [institution, setInstitution] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{ 
    displayName?: string
    email?: string
    institution?: string
    password?: string
    confirmPassword?: string 
  }>({})

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors: { 
      displayName?: string
      email?: string
      institution?: string
      password?: string
      confirmPassword?: string 
    } = {}

    if (!displayName) {
      newErrors.displayName = 'Name is required'
    } else if (displayName.length < 2) {
      newErrors.displayName = 'Name must be at least 2 characters'
    }

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!institution) {
      newErrors.institution = 'Please select your institution'
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
      await onSubmit(displayName, email, password, institution)
    } catch (error) {
      // Error handling is done in the parent component
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Display Name Input */}
      <div>
        <label htmlFor="displayName" className="block text-xs font-medium text-text-gray mb-1">
          Full Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-4 w-4 text-text-gray" />
          </div>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value)
              if (errors.displayName) setErrors({ ...errors, displayName: undefined })
            }}
            placeholder="John Doe"
            className={`w-full pl-10 pr-3 py-2.5 text-sm bg-dark-card border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-0 ${
              errors.displayName 
                ? 'border-red-500/50 text-red-500 placeholder-red-500/70 focus:border-red-500' 
                : 'border-white/10 text-white placeholder-text-gray focus:border-primary'
            }`}
          />
        </div>
        {errors.displayName && (
          <div className="mt-1.5 flex items-center gap-1.5 text-red-500">
            <AlertCircle className="w-3.5 h-3.5" />
            <p className="text-xs">{errors.displayName}</p>
          </div>
        )}
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-xs font-medium text-text-gray mb-1">
          Email Address
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
            placeholder="you@example.com"
            className={`w-full pl-10 pr-3 py-2.5 text-sm bg-dark-card border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-0 ${
              errors.email 
                ? 'border-red-500/50 text-red-500 placeholder-red-500/70 focus:border-red-500' 
                : 'border-white/10 text-white placeholder-text-gray focus:border-primary'
            }`}
          />
        </div>
        {errors.email && (
          <div className="mt-1.5 flex items-center gap-1.5 text-red-500">
            <AlertCircle className="w-3.5 h-3.5" />
            <p className="text-xs">{errors.email}</p>
          </div>
        )}
      </div>

      {/* Institution Select */}
      <div>
        <label htmlFor="institution" className="block text-xs font-medium text-text-gray mb-1">
          Institution
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <School className="h-4 w-4 text-text-gray" />
          </div>
          <select
            id="institution"
            value={institution}
            onChange={(e) => {
              setInstitution(e.target.value)
              if (errors.institution) setErrors({ ...errors, institution: undefined })
            }}
            className={`w-full pl-10 pr-10 py-2.5 text-sm bg-dark-card border rounded-lg transition-colors duration-200 appearance-none focus:outline-none focus:ring-0 ${
              errors.institution 
                ? 'border-red-500/50 text-red-500 placeholder-red-500/70 focus:border-red-500' 
                : 'border-white/10 text-white placeholder-text-gray focus:border-primary'
            } ${!institution ? 'text-text-gray' : 'text-white'}`}
          >
            {institutions.map(inst => (
              <option key={inst.value} value={inst.value} disabled={inst.disabled} className="bg-dark-card text-white">
                {inst.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-text-gray" />
          </div>
        </div>
        {errors.institution && (
          <div className="mt-1.5 flex items-center gap-1.5 text-red-500">
            <AlertCircle className="w-3.5 h-3.5" />
            <p className="text-xs">{errors.institution}</p>
          </div>
        )}
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password-register" className="block text-xs font-medium text-text-gray mb-1">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 text-text-gray" />
          </div>
          <input
            id="password-register"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors({ ...errors, password: undefined })
            }}
            placeholder="••••••••"
            className={`w-full pl-10 pr-10 py-2.5 text-sm bg-dark-card border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-0 ${
              errors.password 
                ? 'border-red-500/50 text-red-500 placeholder-red-500/70 focus:border-red-500' 
                : 'border-white/10 text-white placeholder-text-gray focus:border-primary'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-text-gray hover:text-white"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <div className="mt-1.5 flex items-center gap-1.5 text-red-500">
            <AlertCircle className="w-3.5 h-3.5" />
            <p className="text-xs">{errors.password}</p>
          </div>
        )}
      </div>

      {/* Confirm Password Input */}
      <div>
        <label htmlFor="confirm-password" className="block text-xs font-medium text-text-gray mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 text-text-gray" />
          </div>
          <input
            id="confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined })
            }}
            placeholder="••••••••"
            className={`w-full pl-10 pr-10 py-2.5 text-sm bg-dark-card border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-0 ${
              errors.confirmPassword 
                ? 'border-red-500/50 text-red-500 placeholder-red-500/70 focus:border-red-500' 
                : 'border-white/10 text-white placeholder-text-gray focus:border-primary'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-text-gray hover:text-white"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <div className="mt-1.5 flex items-center gap-1.5 text-red-500">
            <AlertCircle className="w-3.5 h-3.5" />
            <p className="text-xs">{errors.confirmPassword}</p>
          </div>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-primary text-dark rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 disabled:bg-primary/50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
          ) : (
            'Create Account'
          )}
        </button>
      </div>
    </form>
  )
}
