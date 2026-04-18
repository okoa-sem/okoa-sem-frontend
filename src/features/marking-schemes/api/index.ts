import { httpClient } from '@/core/http/client'
import {
  GenerateMarkingSchemeRequest,
  GenerateMarkingSchemeApiResponse,
  CheckMarkingSchemeStatusApiResponse,
  GetMarkingSchemesApiResponse,
  MarkingSchemeGenerationData,
  MarkingSchemeStatusData,
  MarkingSchemeContent,
} from '../types'

const MARKING_SCHEMES_BASE = '/marking-schemes'

/**
 * Generate a marking scheme for an exam paper
 * POST /api/v1/marking-schemes/generate
 */
export const generateMarkingScheme = async (
  request: GenerateMarkingSchemeRequest
): Promise<MarkingSchemeGenerationData> => {
  try {
    const response = await httpClient.post<GenerateMarkingSchemeApiResponse>(
      `${MARKING_SCHEMES_BASE}/generate`,
      request
    )
    return response.data.data
  } catch (error: any) {
    console.error('API: Generation error:', error)
    throw new Error(
      error.response?.data?.message || error.message || 'Failed to generate marking scheme'
    )
  }
}

/**
 * Check the status of a marking scheme generation
 * GET /api/v1/marking-schemes/status/:sessionId
 */
export const checkMarkingSchemeStatus = async (
  sessionId: string
): Promise<MarkingSchemeStatusData> => {
  try {
    const response = await httpClient.get<CheckMarkingSchemeStatusApiResponse>(
      `${MARKING_SCHEMES_BASE}/status/${sessionId}`
    )
    return response.data.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to check marking scheme status'
    )
  }
}

/**
 * Get all marking schemes for the current user
 * GET /api/v1/marking-schemes
 */
export const getMarkingSchemes = async (): Promise<MarkingSchemeContent[]> => {
  try {
    const response = await httpClient.get<GetMarkingSchemesApiResponse>(
      MARKING_SCHEMES_BASE
    )
    return response.data.data.markingSchemes
  } catch (error: any) {
    console.error('API: Error fetching marking schemes:', error)
    throw new Error(
      error.response?.data?.message || error.message || 'Failed to fetch marking schemes'
    )
  }
}

/**
 * Get a specific marking scheme by ID
 * GET /api/v1/marking-schemes/:id
 */
export const getMarkingSchemeById = async (
  id: string
): Promise<MarkingSchemeContent> => {
  try {
    const response = await httpClient.get<{
      success: boolean
      message: string
      data: MarkingSchemeContent
    }>(`${MARKING_SCHEMES_BASE}/${id}`)
    return response.data.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch marking scheme'
    )
  }
}

/**
 * Delete a marking scheme
 * DELETE /api/v1/marking-schemes/:id
 */
export const deleteMarkingScheme = async (id: string): Promise<void> => {
  try {
    await httpClient.delete(`${MARKING_SCHEMES_BASE}/${id}`)
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to delete marking scheme'
    )
  }
}
