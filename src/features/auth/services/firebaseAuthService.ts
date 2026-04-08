

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  Unsubscribe,
} from 'firebase/auth'
import { getFirebaseAuth } from '@/config/firebase'

// Cache for auth state to reduce Firebase API calls
let authStateCache: FirebaseUser | null = null
let authStateUnsubscribe: Unsubscribe | null = null

/**
 * Initialize auth state listener for efficient state management
 * This prevents repeated Firebase API calls for auth checks
 */
export const initializeAuthStateListener = async () => {
  if (authStateUnsubscribe) {
    return // Already initialized
  }

  const auth = await getFirebaseAuth()

  authStateUnsubscribe = onAuthStateChanged(auth, (user) => {
    authStateCache = user
  })
}

/**
 * Get cached auth state
 * Reduces Firebase API calls and improves performance
 */
export const getCachedAuthState = (): FirebaseUser | null => {
  return authStateCache
}

/**
 * Cleanup auth state listener
 */
export const cleanupAuthStateListener = () => {
  if (authStateUnsubscribe) {
    authStateUnsubscribe()
    authStateUnsubscribe = null
  }
}

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const auth = await getFirebaseAuth()
    const result = await signInWithEmailAndPassword(auth, email, password)
    authStateCache = result.user
    return result
  } catch (error) {
    console.error('Email sign-in failed:', error)
    throw error
  }
}

/**
 * Create user account with email and password
 */
export const createUserAccount = async (email: string, password: string) => {
  try {
    const auth = await getFirebaseAuth()
    const result = await createUserWithEmailAndPassword(auth, email, password)
    authStateCache = result.user
    return result
  } catch (error) {
    console.error('Account creation failed:', error)
    throw error
  }
}

/**
 * Sign in with Google
 * Uses popup for better mobile support
 */
export const signInWithGoogle = async () => {
  try {
    const auth = await getFirebaseAuth()
    const provider = new GoogleAuthProvider()

    // Configure for optimal performance
    provider.setCustomParameters({
      prompt: 'select_account',
    })

    const result = await signInWithPopup(auth, provider)
    authStateCache = result.user

    // Get Google OAuth token for backend communication
    const credential = GoogleAuthProvider.credentialFromResult(result)
    const token = credential?.idToken

    return {
      user: result.user,
      idToken: token,
    }
  } catch (error) {
    console.error('Google sign-in failed:', error)
    throw error
  }
}

/**
 * Sign out current user
 */
export const signOutUser = async () => {
  try {
    const auth = await getFirebaseAuth()
    await signOut(auth)
    authStateCache = null
  } catch (error) {
    console.error('Sign out failed:', error)
    throw error
  }
}

/**
 * Get Firebase ID token for backend requests
 * Tokens are cached and reused for 1 hour
 */
export const getFirebaseIdToken = async (): Promise<string | null> => {
  const user = getCachedAuthState()
  if (!user) {
    return null
  }

  try {
    const token = await user.getIdToken(false) 
    return token
  } catch (error) {
    console.error('Failed to get ID token:', error)
    return null
  }
}

/**
 * Get Firebase ID token with force refresh
 * Use sparingly as this forces a new token from Firebase servers
 */
export const getFirebaseIdTokenForced = async (): Promise<string | null> => {
  const user = getCachedAuthState()
  if (!user) {
    return null
  }

  try {
    const token = await user.getIdToken(true) // true = force refresh
    return token
  } catch (error) {
    console.error('Failed to get ID token (forced):', error)
    return null
  }
}

/**
 * Get current user
 */
export const getCurrentFirebaseUser = (): FirebaseUser | null => {
  return getCachedAuthState()
}

/**
 * Check if user is authenticated
 */
export const isFirebaseAuthenticated = (): boolean => {
  return authStateCache !== null
}
