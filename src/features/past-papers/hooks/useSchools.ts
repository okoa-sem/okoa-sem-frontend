import { useQuery } from '@tanstack/react-query';
import { papersService } from '../services/papersService';

export const useSchoolNames = () => {
  return useQuery({
    queryKey: ['schoolNames'],
    queryFn: papersService.getSchoolNames,
  });
};

export const useSchoolCodes = () => {
  return useQuery({
    queryKey: ['schoolCodes'],
    queryFn: papersService.getSchoolCodes,
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
