

import { signInWithGoogle } from '@/features/auth/services/firebaseAuthService'
import { httpClient } from '@/core/http/client'
import { logger } from '@/core/monitoring/logger'
import { User } from '@/features/auth/types'

export interface GoogleAuthRequest {
  idToken: string
}

export interface GoogleAuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    accessToken: string
    refreshToken: string
    tokenType: string
    expiresIn: number
  }
}

export const signInWithGoogleAuth = async (): Promise<GoogleAuthResponse> => {
  try {
    // Step 1: Authenticate with Firebase
    const { user, idToken } = await signInWithGoogle()

    if (!idToken) {
      throw new Error('Failed to get Google ID token from Firebase')
    }

    // Step 2: Send to backend for verification and account creation/linking
    const response = await httpClient.post<GoogleAuthResponse>(
      '/auth/google',
      {
        idToken,
      } as GoogleAuthRequest
    )
    return response.data
  } catch (error: any) {
    // Handle user cancellation gracefully
    if (error.code === 'auth/popup-closed-by-user') {
      logger.info('User closed the Google sign-in popup')
      throw new Error('Sign-in was cancelled. Please try again.')
    }

    logger.error('Google sign-in failed', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      code: error.code,
    })
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
      '/auth/google',
      {
        idToken,
      } as GoogleAuthRequest
    )

    return response.data
  } catch (error: any) {
    logger.error('Google sign-up failed', {
      status: error.response?.status,
      message: error.message,
    })
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
    logger.error('Failed to link Google account', {
      status: error.response?.status,
      message: error.message,
    })
    throw error
  }
}
