'use client'

import React, { useEffect, ReactNode } from 'react'
import { initializeAuthStateListener, cleanupAuthStateListener } from '@/features/auth/services/firebaseAuthService'
import { getFirebaseApp, getFirebaseAnalytics, getFirebasePerformance } from '@/config/firebase'

interface FirebaseProviderProps {
  children: ReactNode
}

/**
 * Firebase Provider
 * Initializes Firebase services and auth state listener on app mount
 * Optimized for high-traffic scenarios
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize Firebase app and services
    try {
      getFirebaseApp()

      // Initialize analytics only in browser
      if (typeof window !== 'undefined') {
        getFirebaseAnalytics()
        getFirebasePerformance()
      }

      // Initialize auth state listener for efficient auth management
      initializeAuthStateListener().catch(error => {
        console.error('Failed to initialize auth state listener:', error)
      })
    } catch (error) {
      console.error('Firebase initialization error:', error)
    }

    // Cleanup on unmount
    return () => {
      cleanupAuthStateListener()
    }
  }, [])

  return <>{children}</>
}

export default FirebaseProvider
