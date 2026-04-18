// src/features/marking-schemes/utils/markingSchemeStorage.ts

import { logger } from '@/core/monitoring/logger'

const STORAGE_KEY = 'okoa_sem_marking_schemes'

export interface LocalMarkingScheme {
  id: string
  paperId: string
  paperCode: string
  paperTitle: string
  paperYear: number
  paperSemester: string
  paperExamType: string
  content: string
  createdAt: string  // ISO string
  updatedAt: string  // ISO string
}

export const markingSchemeStorage = {
  getAll(): LocalMarkingScheme[] {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },

  save(scheme: LocalMarkingScheme): void {
    if (typeof window === 'undefined') return
    try {
      const schemes = markingSchemeStorage.getAll()
      // Replace existing entry for the same paper, or add new
      const existingIndex = schemes.findIndex(s => s.paperId === scheme.paperId)
      if (existingIndex >= 0) {
        schemes[existingIndex] = { ...scheme, updatedAt: new Date().toISOString() }
      } else {
        schemes.unshift(scheme) // newest first
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schemes))
    } catch (e) {
      logger.error('Failed to save marking scheme')
    }
  },

  /**
   * Update only the content field of an existing entry.
   * If no entry exists for this paperId, a new one is created using `fallback`.
   */
  updateContent(
    paperId: string,
    content: string,
    fallback?: Omit<LocalMarkingScheme, 'content' | 'updatedAt'>
  ): void {
    if (typeof window === 'undefined') return
    try {
      const schemes = markingSchemeStorage.getAll()
      const idx = schemes.findIndex(s => s.paperId === paperId)
      if (idx >= 0) {
        // Preserve all existing metadata (year, semester etc), only overwrite content
        schemes[idx] = { ...schemes[idx], content, updatedAt: new Date().toISOString() }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(schemes))
      } else if (fallback) {
        // Entry doesn't exist yet (user opened chatbot without going through modal)
        schemes.unshift({ ...fallback, content, updatedAt: new Date().toISOString() })
        localStorage.setItem(STORAGE_KEY, JSON.stringify(schemes))
      }
    } catch (e) {
      logger.error('Failed to update marking scheme content')
    }
  },

  delete(id: string): void {
    if (typeof window === 'undefined') return
    try {
      const schemes = markingSchemeStorage.getAll().filter(s => s.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schemes))
    } catch (e) {
      logger.error('Failed to delete marking scheme')
    }
  },

  getById(id: string): LocalMarkingScheme | undefined {
    return markingSchemeStorage.getAll().find(s => s.id === id)
  },

  getByPaperId(paperId: string): LocalMarkingScheme | undefined {
    return markingSchemeStorage.getAll().find(s => s.paperId === paperId)
  },
}