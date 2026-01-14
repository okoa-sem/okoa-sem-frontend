export interface ProfileUser {
  id: number;
  email: string;
  displayName: string;
  photoUrl: string | null;
  institution: string | null;
  emailVerified: boolean;
  authProvider: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: ProfileUser;
}

export interface RemoveProfileImageResponse {
  success: boolean;
  message: string;
  data: null;
}
