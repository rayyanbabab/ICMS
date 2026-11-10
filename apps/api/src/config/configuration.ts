export default () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_key_development',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_development',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(','),
  },
  paymentSandbox: process.env.PAYMENT_SANDBOX_MODE === 'true',
});

