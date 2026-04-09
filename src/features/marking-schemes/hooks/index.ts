// src/features/marking-schemes/hooks/index.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { markingSchemeStorage, LocalMarkingScheme } from '../utils/markingSchemeStorage'

export const markingSchemeKeys = {
  all: ['markingSchemes'] as const,
  lists: () => [...markingSchemeKeys.all, 'list'] as const,
  detail: (id: string) => [...markingSchemeKeys.all, 'detail', id] as const,
}

/**
 * Read all marking schemes from localStorage
 */
export const useMarkingSchemes = () => {
  return useQuery({
    queryKey: markingSchemeKeys.lists(),
    queryFn: () => markingSchemeStorage.getAll(),
    staleTime: 0, // always reread from localStorage on focus
  })
}

/**
 * Get a specific marking scheme by ID from localStorage
 */
export const useMarkingSchemeById = (id: string | null) => {
  return useQuery({
    queryKey: markingSchemeKeys.detail(id || ''),
    queryFn: () => markingSchemeStorage.getById(id!) ?? null,
    enabled: !!id,
  })
}

/**
 * Delete a marking scheme from localStorage
 */
export const useDeleteMarkingScheme = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      markingSchemeStorage.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: markingSchemeKeys.lists() })
    },
  })
}

// Keep these exports so existing imports don't break
export const useGenerateMarkingScheme = () => {
  // Saving is now handled directly inside GenerateMarkingSchemeModal
  return { mutateAsync: async (_: number) => {}, isPending: false }
}

export const useCheckMarkingSchemeStatus = (_sessionId: string | null) => {
  return { data: undefined, isLoading: false }
}