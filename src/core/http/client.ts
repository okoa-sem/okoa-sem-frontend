import axios, { AxiosInstance } from 'axios'
import { setupInterceptors } from './interceptors'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

// Create the Axios Instance
export const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds for long-running operations like marking scheme generation
})

// Setup interceptors
setupInterceptors(httpClient)