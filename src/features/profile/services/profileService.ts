import { httpClient } from '@/core/http/client'
import { ProfileResponse, RemoveProfileImageResponse } from '../types'

const BASE_URL = '/profile'

/**
 * Upload a profile image
 * @param file The image file to upload
 */
export const uploadProfileImage = async (file: File): Promise<ProfileResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await httpClient.post<ProfileResponse>(
    `${BASE_URL}/image`, 
    formData, 
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response.data
}

/**
 * Remove the current profile image
 */
export const removeProfileImage = async (): Promise<RemoveProfileImageResponse> => {
  const response = await httpClient.delete<RemoveProfileImageResponse>(`${BASE_URL}/image`)
  return response.data
}
