/**
 * Auth Domain Types
 */

// --- API Response Wrappers ---
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// --- Entities ---
export interface User {
  id: number
  email: string
  displayName: string
  institution?: string
  photoUrl: string | null
  emailVerified: boolean
  role: 'USER' | 'ADMIN'
  authProvider: 'EMAIL' | 'GOOGLE'
}

// --- Request DTOs ---
export interface SignupRequest {
  email: string
  password: string
  displayName: string
  institution?: string
}

export interface VerifyEmailRequest {
  email: string
  code: string
  type: 'EMAIL_VERIFICATION'
}

export interface LoginRequest {
  email: string
  password: string
}

export interface VerifyLogin2FARequest {
  email: string
  code: string
  type: 'LOGIN_2FA'
}

export interface ResendOtpRequest {
  email: string
  type: 'EMAIL_VERIFICATION' | 'LOGIN_2FA' | 'PASSWORD_RESET'
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  code: string
  newPassword: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

// --- Response DTOs ---
export interface OtpSentResponse {
  message: string
  email: string
  expiresIn: number
}

export interface VerificationResponse {
  message: string
  email: string
  verified: boolean
}

export interface AuthSuccessResponse {
  accessToken: string
  refreshToken: string
  tokenType: string;
  expiresIn: number;
  user: User;
}