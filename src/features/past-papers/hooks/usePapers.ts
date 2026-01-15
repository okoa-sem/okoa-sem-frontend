import { useQuery } from '@tanstack/react-query';
import { papersService } from '../services/papersService';
import { ApiSingleResponse, PaginatedData, ExamPaper, SearchPapersParams } from '../types/api';

interface UsePapersOptions {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  schoolCode?: string;
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
    queryFn: () => {
      if (options.schoolCode) {
        return papersService.searchPapers({
          year,
          schoolCode: options.schoolCode,
          page: options.page,
          size: options.size,
          sortBy: options.sortBy,
          sortDirection: options.sortDirection,
        });
      }
      return papersService.getPapersByYear(year, options);
    },
    enabled: !!year,
  });
};

export const useLatestPapers = (options: { page?: number; size?: number; schoolCode?: string } = {}) => {
  return useQuery({
    queryKey: ['papers', 'latest', options],
    queryFn: () => {
      if (options.schoolCode) {
        return papersService.searchPapers({
          schoolCode: options.schoolCode,
          page: options.page,
          size: options.size,
          sortBy: 'uploadedAt',
          sortDirection: 'DESC',
        });
      }
      return papersService.getLatestPapers(options);
    },
  });
};

export const useSearchPapers = (params: SearchPapersParams) => {
  return useQuery({
    queryKey: ['papers', 'search', params],
    queryFn: () => papersService.searchPapers(params),
  });
};
