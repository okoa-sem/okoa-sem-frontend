export const profileKeys = {
  all: ['profile'] as const,
  details: () => [...profileKeys.all, 'details'] as const,
  image: () => [...profileKeys.all, 'image'] as const,
}

export const authKeys = {
  user: ['auth', 'user'] as const,
}

export const chatKeys = {
  all: ['chat'] as const,
  sessions: () => [...chatKeys.all, 'sessions'] as const,
  sessionsList: () => [...chatKeys.sessions(), 'list'] as const,
  allSessions: () => [...chatKeys.sessions(), 'all'] as const,
  sessionDetails: (sessionId: string) => [...chatKeys.sessions(), sessionId] as const,
  search: (keyword: string) => [...chatKeys.sessions(), 'search', keyword] as const,
  count: () => [...chatKeys.all, 'count'] as const,
}

export const messageKeys = {
  all: ['messages'] as const,
  bySession: (sessionId: string) => [...messageKeys.all, 'session', sessionId] as const,
  sessionMessages: (sessionId: string) => [...messageKeys.bySession(sessionId), 'all'] as const,
  messagesByRole: (sessionId: string, role: string) => [...messageKeys.bySession(sessionId), 'role', role] as const,
  latestMessage: (sessionId: string) => [...messageKeys.bySession(sessionId), 'latest'] as const,
  messageCount: (sessionId: string) => [...messageKeys.bySession(sessionId), 'count'] as const,
  recentMessages: (sessionId: string, timestamp: string) => [...messageKeys.bySession(sessionId), 'recent', timestamp] as const,
  messageDetails: (messageId: string) => [...messageKeys.all, 'details', messageId] as const,
}

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  history: () => [...subscriptionKeys.all, 'history'] as const,
  access: () => [...subscriptionKeys.all, 'access'] as const,
}

