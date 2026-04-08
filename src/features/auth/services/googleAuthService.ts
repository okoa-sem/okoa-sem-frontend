

import { signInWithGoogle } from '@/features/auth/services/firebaseAuthService'
import { httpClient } from '@/core/http/client'
import { User } from '@/features/auth/types'

export interface GoogleAuthRequest {
  idToken: string
  email: string
  displayName?: string
}

export interface GoogleAuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export const signInWithGoogleAuth = async (): Promise<GoogleAuthResponse> => {
  try {
    // Step 1: Authenticate with Firebase
    const { user, idToken } = await signInWithGoogle()

    if (!idToken) {
      throw new Error('Failed to get Google ID token')
    }

    // Step 2: Send to backend for verification and account creation/linking
    const response = await httpClient.post<GoogleAuthResponse>(
      '/auth/google-signin',
      {
        idToken,
        email: user.email,
        displayName: user.displayName,
      } as GoogleAuthRequest
    )

    return response.data
  } catch (error: any) {
    console.error('Google sign-in failed:', error)
    throw error
  }
}

/**
 * Sign up with Google
 * Same as sign-in but specifically for new account creation
 */
export const signUpWithGoogleAuth = async (): Promise<GoogleAuthResponse> => {
  try {
    // Step 1: Authenticate with Firebase
    const { user, idToken } = await signInWithGoogle()

    if (!idToken) {
      throw new Error('Failed to get Google ID token')
    }

    // Step 2: Send to backend for account creation
    const response = await httpClient.post<GoogleAuthResponse>(
      '/auth/google-signup',
      {
        idToken,
        email: user.email,
        displayName: user.displayName,
      } as GoogleAuthRequest
    )

    return response.data
  } catch (error: any) {
    console.error('Google sign-up failed:', error)
    throw error
  }
}

/**
 * Link existing account with Google
 * For users who already have an account and want to add Google login
 */
export const linkGoogleToExistingAccount = async (): Promise<GoogleAuthResponse> => {
  try {
    const { user, idToken } = await signInWithGoogle()

    if (!idToken) {
      throw new Error('Failed to get Google ID token')
    }

    const response = await httpClient.post<GoogleAuthResponse>(
      '/auth/google-link',
      {
        idToken,
        email: user.email,
        displayName: user.displayName,
      } as GoogleAuthRequest
    )

    return response.data
  } catch (error: any) {
    console.error('Failed to link Google account:', error)
    throw error
  }
}
