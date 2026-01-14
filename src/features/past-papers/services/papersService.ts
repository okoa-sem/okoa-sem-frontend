import { httpClient } from '@/core/http/client';
import { SchoolsResponse } from '../types';

const BASE_URL = '/exam-papers';

export const papersService = {
  getSchoolNames: async (): Promise<string[]> => {
    const response = await httpClient.get<SchoolsResponse<string>>(`${BASE_URL}/schools/names`);
    return response.data.data;
  },

  getSchoolCodes: async (): Promise<string[]> => {
    const response = await httpClient.get<SchoolsResponse<string>>(`${BASE_URL}/schools/codes`);
    return response.data.data;
  },

  getAllYears: async (): Promise<number[]> => {
    const response = await httpClient.get<SchoolsResponse<number>>(`${BASE_URL}/years`);
    return response.data.data;
  },

  getYearsBySchool: async (schoolId: string): Promise<number[]> => {
    const response = await httpClient.get<SchoolsResponse<number>>(`${BASE_URL}/schools/${schoolId}/years`);
    return response.data.data;
  },
};
