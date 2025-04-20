import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  api: {
    prefix: process.env.API_PREFIX || '/api',
    version: process.env.API_VERSION || 'v1',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};