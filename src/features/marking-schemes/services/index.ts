import {
  generateMarkingScheme,
  checkMarkingSchemeStatus,
  getMarkingSchemes,
  getMarkingSchemeById,
  deleteMarkingScheme,
} from '../api'
import {
  GenerateMarkingSchemeRequest,
  MarkingSchemeGenerationData,
  MarkingSchemeStatusData,
  MarkingSchemeContent,
} from '../types'

/**
 * Marking Schemes Service
 * High-level service functions for marking scheme operations
 * Provides business logic layer between components and API calls
 */

export const markingSchemesService = {
  /**
   * Generate a marking scheme for an exam paper
   * @param examPaperId - The ID of the exam paper
   * @returns Generation data with sessionId to track progress
   */
  generateMarkingScheme: async (
    examPaperId: number
  ): Promise<MarkingSchemeGenerationData> => {
    const request: GenerateMarkingSchemeRequest = { examPaperId }
    return generateMarkingScheme(request)
  },

  /**
   * Check the status of a marking scheme generation
   * @param sessionId - The session ID returned from generation
   * @returns Current status and content if completed
   */
  checkStatus: async (sessionId: string): Promise<MarkingSchemeStatusData> => {
    return checkMarkingSchemeStatus(sessionId)
  },

  /**
   * Get all marking schemes for the current user
   * @returns Array of marking schemes
   */
  getAll: async (): Promise<MarkingSchemeContent[]> => {
    return getMarkingSchemes()
  },

  /**
   * Get a specific marking scheme by ID
   * @param id - The marking scheme ID
   * @returns The marking scheme content
   */
  getById: async (id: string): Promise<MarkingSchemeContent> => {
    return getMarkingSchemeById(id)
  },

  /**
   * Delete a marking scheme
   * @param id - The marking scheme ID
   */
  delete: async (id: string): Promise<void> => {
    return deleteMarkingScheme(id)
  },
}
