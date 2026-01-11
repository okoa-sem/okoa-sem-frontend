import { httpClient } from '@/core/http/client'
import { 
  ApiResponse, 
  SignupRequest, 
  OtpSentResponse, 
  VerifyEmailRequest, 
  VerifyLogin2FARequest,
  LoginRequest,
  AuthSuccessResponse,
  ResendOtpRequest,
  VerificationResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest
} from '@/features/auth/types'

const AUTH_BASE = '/auth' 

/**
 * Step 1: Register a new user (Triggers OTP)
 */
export const register = async (data: SignupRequest): Promise<OtpSentResponse> => {
  try {
    const response = await httpClient.post<ApiResponse<OtpSentResponse>>(`${AUTH_BASE}/signup`, data)
    return response.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed')
  }
}

/**
 * Step 2: Verify Email with OTP
 */
export const verifyEmail = async (data: VerifyEmailRequest): Promise<VerificationResponse> => {
  try {
    const response = await httpClient.post<ApiResponse<VerificationResponse>>(`${AUTH_BASE}/verify-email`, data)
    return response.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Invalid verification code')
  }
}

/**
 * Step 1: Login (Triggers 2FA)
 */
export const login = async (data: LoginRequest): Promise<OtpSentResponse> => {
  try {
    const response = await httpClient.post<ApiResponse<OtpSentResponse>>(`${AUTH_BASE}/login`, data)
    return response.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Invalid credentials')
  }
}

/**
 * Step 2: Verify Login 2FA (Returns Tokens)
 */
export const verifyLogin2FA = async (data: VerifyLogin2FARequest): Promise<AuthSuccessResponse> => {
  try {
    const response = await httpClient.post<ApiResponse<AuthSuccessResponse>>(`${AUTH_BASE}/verify-login-2fa`, data)
    return response.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Invalid 2FA code')
  }
}

/**
 * Resend OTP
 */
export const resendOtp = async (data: ResendOtpRequest): Promise<OtpSentResponse> => {
  try {
    const response = await httpClient.post<ApiResponse<OtpSentResponse>>(`${AUTH_BASE}/resend-otp`, data)
    return response.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to resend code')
  }
}

/**
 * Forgot Password
 */
export const forgotPassword = async (data: ForgotPasswordRequest): Promise<OtpSentResponse> => {
  try {
    const response = await httpClient.post<ApiResponse<OtpSentResponse>>(`${AUTH_BASE}/forgot-password`, data)
    return response.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to process request')
  }
}

/**
 * Reset Password
 */
export const resetPassword = async (data: ResetPasswordRequest): Promise<VerificationResponse> => {
  try {
    const response = await httpClient.post<ApiResponse<VerificationResponse>>(`${AUTH_BASE}/reset-password`, data)
    return response.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Password reset failed')
  }
}

/**
 * Refresh Token
 */
export const refreshToken = async (data: RefreshTokenRequest): Promise<AuthSuccessResponse> => {
  try {
    const response = await httpClient.post<ApiResponse<AuthSuccessResponse>>(`${AUTH_BASE}/refresh`, data)
    return response.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Session expired')
  }
}

/**
 * Logout
 */
export const logout = async (): Promise<void> => {
  try {
    await httpClient.post(`${AUTH_BASE}/logout`)
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  } catch (error) {
    console.error('Logout error', error)
  }
}