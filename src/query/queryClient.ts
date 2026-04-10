import { QueryClient } from '@tanstack/react-query'

/**
 * Optimized QueryClient Configuration for High-Traffic Scenarios (5000+ concurrent users)

 */

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      // Prevents redundant API calls when users navigate between pages
      staleTime: 5 * 60 * 1000,

      // Cache data for 10 minutes in memory
      // Reduces bandwidth and improves perceived performance
      gcTime: 10 * 60 * 1000,

      // Retry failed requests with exponential backoff
      // Max 3 attempts: immediate, 500ms, 1s
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (except 429 - rate limit)
        if (error?.response?.status >= 400 && error?.response?.status !== 429) {
          return false
        }
        // Retry maximum 3 times
        return failureCount < 3
      },

      // Don't refetch on window focus to reduce API calls
      // Users on slow/mobile connections benefit from this
      refetchOnWindowFocus: false,

      // Don't refetch when user returns to stale tabs/windows
      refetchOnReconnect: false,

      // Don't refetch on mount if data is still fresh
      refetchOnMount: false,
    },

    mutations: {
      // Retry mutations once on network errors
      // 4xx errors don't retry
      retry: (failureCount, error: any) => {
        if (error?.response?.status >= 400) {
          return false
        }
        return failureCount < 1
      },
    },
  },
})

