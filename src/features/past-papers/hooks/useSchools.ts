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
