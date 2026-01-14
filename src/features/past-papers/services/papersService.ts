import { httpClient } from '@/core/http/client';
import { SchoolsResponse } from '../types';

const BASE_URL = '/exam-papers/schools';

export const papersService = {
  getSchoolNames: async (): Promise<string[]> => {
    const response = await httpClient.get<SchoolsResponse<string>>(`${BASE_URL}/names`);
    return response.data.data;
  },

  getSchoolCodes: async (): Promise<string[]> => {
    const response = await httpClient.get<SchoolsResponse<string>>(`${BASE_URL}/codes`);
    return response.data.data;
  },
};
