export const SecurityConstants = {
  JWT: {
    SECRET: process.env.JWT_SECRET || 'fallback-development-secret-change-in-production',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    ISSUER: process.env.JWT_ISSUER || 'your-app-name',
    AUDIENCE: process.env.JWT_AUDIENCE || 'your-app-users',
  },
  AUTH: {
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_TIME: 15 * 60 * 1000, // 15 minutes
    PASSWORD_MIN_LENGTH: 8,
    TOKEN_TYPE: 'Bearer',
  },
  RATE_LIMITING: {
    MAX_REQUESTS: 100,
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  }
} as const;