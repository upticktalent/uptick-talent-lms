export const EnvironmentConfig = {
  // Current environment
  CURRENT: process.env.APP_ENV || process.env.NODE_ENV || 'development',
  
  // Environment flags
  IS_PRODUCTION: (process.env.APP_ENV || process.env.NODE_ENV) === 'production',
  IS_DEVELOPMENT: (process.env.APP_ENV || process.env.NODE_ENV) === 'development',
  IS_TEST: (process.env.APP_ENV || process.env.NODE_ENV) === 'test',
  IS_STAGING: (process.env.APP_ENV || process.env.NODE_ENV) === 'staging',
  
  // Environment-specific configurations
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
  CLIENT_BASE_URL: process.env.CLIENT_BASE_URL || 'http://localhost:3000',
  
  // Feature flags based on environment
  FEATURES: {
    SHOW_DEBUG_INFO: (process.env.APP_ENV || process.env.NODE_ENV) !== 'production',
    ENABLE_TEST_ROUTES: (process.env.APP_ENV || process.env.NODE_ENV) === 'development',
    LOG_QUERIES: (process.env.APP_ENV || process.env.NODE_ENV) === 'development',
  }
} as const;