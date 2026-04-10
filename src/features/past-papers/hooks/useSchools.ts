import { useQuery } from '@tanstack/react-query';
import { papersService } from '../services/papersService';
import { SCHOOLS } from '@/shared/constants';

export const useSchoolNames = () => {
  return useQuery({
    queryKey: ['schoolNames'],
    queryFn: async () => {
      try {
        return await papersService.getSchoolNames();
      } catch (error) {
        // Fallback to static school names if backend fetch fails
        console.warn('Failed to fetch school names from backend, using fallback data');
        return SCHOOLS.map(school => school.name);
      }
    },
  });
};

export const useSchoolCodes = () => {
  return useQuery({
    queryKey: ['schoolCodes'],
    queryFn: async () => {
      try {
        return await papersService.getSchoolCodes();
      } catch (error) {
        // Fallback to static school codes if backend fetch fails
        console.warn('Failed to fetch school codes from backend, using fallback data');
        return SCHOOLS.map(school => school.id);
      }
    },
  });
};

export const useAllYears = () => {
  return useQuery({
    queryKey: ['allYears'],
    queryFn: papersService.getAllYears,
  });
};

export const useYearsBySchool = (schoolId: string | undefined) => {
  return useQuery({
    queryKey: ['yearsBySchool', schoolId],
    queryFn: () => papersService.getYearsBySchool(schoolId!),
    enabled: !!schoolId,
  });
};

export const usePaperCountBySchool = (schoolId: string | undefined) => {
  return useQuery({
    queryKey: ['paperCountBySchool', schoolId],
    queryFn: () => papersService.getPaperCountBySchool(schoolId!),
    enabled: !!schoolId,
  });
};

export const usePaperCountByYear = (year: number | undefined | null) => {
  return useQuery({
    queryKey: ['paperCountByYear', year],
    queryFn: () => papersService.getPaperCountByYear(year!),
    enabled: !!year,
  });
};
