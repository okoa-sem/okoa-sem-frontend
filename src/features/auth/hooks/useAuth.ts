
import { STORAGE_KEYS } from '@/shared/constants';

export const useAuth = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) : null;
  
  return {
    token,
    isAuthenticated: !!token,
  };
};
