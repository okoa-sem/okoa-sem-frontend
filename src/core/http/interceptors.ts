import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { refreshToken } from '@/features/auth/services/authService'

let isRefreshing = false
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void }[] = []

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// --- REQUEST INTERCEPTOR ---
const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  // Check if running on the client side
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error)
}

// --- RESPONSE INTERCEPTOR ---
const onResponseSuccess = (response: any) => {
  return response
}

const setupResponseInterceptor = (axiosInstance: AxiosInstance) => {
  const onResponseError = async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Handle only 401 errors and ensure it's not a retry request
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // Avoid multiple refresh calls
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
      .then(token => {
        originalRequest.headers!['Authorization'] = 'Bearer ' + token
        return axiosInstance(originalRequest)
      })
      .catch(err => {
        return Promise.reject(err)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    const currentRefreshToken = localStorage.getItem('refreshToken')
    if (!currentRefreshToken) {
      isRefreshing = false
      // Handle logout logic here
      return Promise.reject(error)
    }

    try {
      const { accessToken, refreshToken: newRefreshToken } = await refreshToken({
        refreshToken: currentRefreshToken,
      })

      localStorage.setItem('authToken', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)

      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      originalRequest.headers!['Authorization'] = `Bearer ${accessToken}`
      
      processQueue(null, accessToken)
      
      return axiosInstance(originalRequest)
    } catch (refreshError: any) {
      processQueue(refreshError, null)
      // Handle logout 
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }

  return { onResponseSuccess, onResponseError }
}


export const setupInterceptors = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(authRequestInterceptor, onRequestError)
  
  const { onResponseSuccess, onResponseError } = setupResponseInterceptor(axiosInstance)
  axiosInstance.interceptors.response.use(onResponseSuccess, onResponseError)
}
