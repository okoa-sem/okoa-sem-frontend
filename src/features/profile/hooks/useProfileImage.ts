import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/app/providers/authentication-provider/AuthenticationProvider';
import { uploadProfileImage, removeProfileImage, } from '../services/profileService';
import { profileKeys } from '@/query/keys';
import { ProfileResponse, RemoveProfileImageResponse } from '../types';

export const useProfileImage = () => {
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuth();

  const uploadMutation = useMutation<ProfileResponse, Error, File>({
    mutationFn: uploadProfileImage,
    onSuccess: (response) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: profileKeys.all });

      // Update the user in auth context to reflect changes immediately
      if (user && response.data) {
        updateUser({
          ...user,
          ...response.data,
          photoUrl: response.data.photoUrl || undefined
        });
      }
    },
  });

  const removeMutation = useMutation<RemoveProfileImageResponse, Error, void>({
    mutationFn: removeProfileImage,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });

      if (user) {
        updateUser({
          ...user,
          photoUrl: undefined,
        });
      }
    },
  });

  return {
    uploadProfileImage: uploadMutation.mutate,
    uploadProfileImageAsync: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,
    uploadResult: uploadMutation.data,

    removeProfileImage: removeMutation.mutate,
    removeProfileImageAsync: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,
    removeError: removeMutation.error,
    removeResult: removeMutation.data,
  };
};
