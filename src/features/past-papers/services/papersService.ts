import { httpClient } from '@/core/http/client';
import { SchoolsResponse, ExamPaper, ApiSingleResponse, PaginatedData, SearchPapersParams } from '../types';

const BASE_URL = '/exam-papers';

export const papersService = {
  getPaperById: async (id: number): Promise<ExamPaper> => {
    const response = await httpClient.get<ApiSingleResponse<ExamPaper>>(`${BASE_URL}/${id}`);
    return response.data.data;
  },

  getPapersByYear: async (
    year: number, 
    params: { page?: number; size?: number; sortBy?: string; sortDirection?: 'ASC' | 'DESC' } = {}
  ): Promise<PaginatedData<ExamPaper>> => {
    const response = await httpClient.get<ApiSingleResponse<PaginatedData<ExamPaper>>>(`${BASE_URL}/years/${year}`, { params });
    return response.data.data;
  },

  getLatestPapers: async (params: { page?: number; size?: number } = {}): Promise<PaginatedData<ExamPaper>> => {
    const response = await httpClient.get<ApiSingleResponse<PaginatedData<ExamPaper>>>(`${BASE_URL}/latest`, { params });
    return response.data.data;
  },

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

  getPaperCountBySchool: async (schoolId: string): Promise<number> => {
    const response = await httpClient.get<ApiSingleResponse<number>>(`${BASE_URL}/schools/${schoolId}/count`);
    return response.data.data;
  },

  getPaperCountByYear: async (year: number): Promise<number> => {
    const response = await httpClient.get<ApiSingleResponse<number>>(`${BASE_URL}/years/${year}/count`);
    return response.data.data;
  },

  searchPapers: async (params: SearchPapersParams): Promise<PaginatedData<ExamPaper>> => {
    const response = await httpClient.get<ApiSingleResponse<PaginatedData<ExamPaper>>>(`${BASE_URL}/search`, { params });
    return response.data.data;
  },
};
