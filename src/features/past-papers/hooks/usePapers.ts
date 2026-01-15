import { useQuery } from '@tanstack/react-query';
import { papersService } from '../services/papersService';
import { ApiSingleResponse, PaginatedData, ExamPaper } from '../types/api';

interface UsePapersOptions {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export const usePaperById = (id: number) => {
  return useQuery({
    queryKey: ['paper', id],
    queryFn: () => papersService.getPaperById(id),
    enabled: !!id,
  });
};

export const usePapersByYear = (year: number, options: UsePapersOptions = {}) => {
  return useQuery({
    queryKey: ['papers', 'year', year, options],
    queryFn: () => papersService.getPapersByYear(year, options),
    enabled: !!year,
  });
};

export const useLatestPapers = (options: { page?: number; size?: number } = {}) => {
  return useQuery({
    queryKey: ['papers', 'latest', options],
    queryFn: () => papersService.getLatestPapers(options),
  });
};
