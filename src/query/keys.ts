export const profileKeys = {
  all: ['profile'] as const,
  details: () => [...profileKeys.all, 'details'] as const,
  image: () => [...profileKeys.all, 'image'] as const,
}

export const authKeys = {
  user: ['auth', 'user'] as const,
}
