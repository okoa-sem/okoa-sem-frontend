import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { markingSchemesService } from '../services'
import { MarkingSchemeContent } from '../types'

/**
 * Query key factory for marking schemes
 */
export const markingSchemeKeys = {
  all: ['markingSchemes'] as const,
  lists: () => [...markingSchemeKeys.all, 'list'] as const,
  list: (filters: string) => [...markingSchemeKeys.lists(), { filters }] as const,
  details: () => [...markingSchemeKeys.all, 'detail'] as const,
  detail: (id: string) => [...markingSchemeKeys.details(), id] as const,
  status: (sessionId: string) => [...markingSchemeKeys.all, 'status', sessionId] as const,
}

/**
 * Hook to get all marking schemes
 */
export const useMarkingSchemes = () => {
  return useQuery({
    queryKey: markingSchemeKeys.lists(),
    queryFn: () => markingSchemesService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to get a specific marking scheme by ID
 */
export const useMarkingSchemeById = (id: string | null) => {
  return useQuery({
    queryKey: markingSchemeKeys.detail(id || ''),
    queryFn: () => markingSchemesService.getById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to generate a marking scheme
 */
export const useGenerateMarkingScheme = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (examPaperId: number) =>
      markingSchemesService.generateMarkingScheme(examPaperId),
    onSuccess: () => {
      // Invalidate the marking schemes list to refresh data when generation completes
      queryClient.invalidateQueries({
        queryKey: markingSchemeKeys.lists(),
      })
    },
  })
}

/**
 * Hook to check marking scheme generation status
 */
export const useCheckMarkingSchemeStatus = (sessionId: string | null) => {
  return useQuery({
    queryKey: markingSchemeKeys.status(sessionId || ''),
    queryFn: () => markingSchemesService.checkStatus(sessionId!),
    enabled: !!sessionId,
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchInterval: (query) => {
      // Stop polling when status is COMPLETED or FAILED
      const data = query.state.data
      if (
        data &&
        (data.status === 'COMPLETED' || data.status === 'FAILED')
      ) {
        return false
      }
      // Poll every 3 seconds while processing
      return 3000
    },
  })
}

/**
 * Hook to delete a marking scheme
 */
export const useDeleteMarkingScheme = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => markingSchemesService.delete(id),
    onSuccess: () => {
      // Invalidate the marking schemes list
      queryClient.invalidateQueries({
        queryKey: markingSchemeKeys.lists(),
      })
    },
  })
}
