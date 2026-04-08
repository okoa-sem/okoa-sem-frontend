

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getAnalytics, Analytics } from 'firebase/analytics'
import { getPerformance } from 'firebase/performance'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
}

// Validate Firebase configuration
const validateFirebaseConfig = (): boolean => {
  const requiredFields = ['apiKey', 'projectId', 'authDomain', 'appId']
  return requiredFields.every(field => Boolean(firebaseConfig[field as keyof typeof firebaseConfig]))
}

// Singleton Firebase App Instance
let app: FirebaseApp | null = null

export const getFirebaseApp = (): FirebaseApp => {
  if (!validateFirebaseConfig()) {
    console.warn('⚠️  Firebase configuration is incomplete. Check your environment variables.')
  }

  // Return existing app or create new one
  const apps = getApps()
  if (apps.length > 0) {
    return getApp()
  }

  app = initializeApp(firebaseConfig)
  return app
}

// Singleton Auth Instance (lazy-loaded)
let auth: Auth | null = null

export const getFirebaseAuth = async (): Promise<Auth> => {
  if (!auth) {
    const firebaseApp = getFirebaseApp()
    auth = getAuth(firebaseApp)

    // Set persistence to LOCAL for better performance with multiple tabs
    try {
      await setPersistence(auth, browserLocalPersistence)
    } catch (error) {
      console.error('Failed to set persistence:', error)
    }
  }
  return auth
}

// Singleton Analytics Instance
let analytics: Analytics | null = null

export const getFirebaseAnalytics = (): Analytics | null => {
  // Only initialize analytics in browser environment
  if (typeof window === 'undefined') {
    return null
  }

  if (!analytics) {
    try {
      const firebaseApp = getFirebaseApp()
      analytics = getAnalytics(firebaseApp)
    } catch (error) {
      console.warn('⚠️  Failed to initialize Firebase Analytics:', error)
    }
  }

  return analytics
}

// Singleton Performance Monitoring Instance
let performance: any = null

export const getFirebasePerformance = (): any => {
  // Only initialize performance monitoring in browser environment
  if (typeof window === 'undefined') {
    return null
  }

  if (!performance) {
    try {
      const firebaseApp = getFirebaseApp()
      performance = getPerformance(firebaseApp)
    } catch (error) {
      console.warn('⚠️  Failed to initialize Firebase Performance Monitoring:', error)
    }
  }

  return performance
}

export default firebaseConfig
