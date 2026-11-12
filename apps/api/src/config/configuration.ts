export default () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const jwtSecret = process.env.JWT_SECRET || (nodeEnv === 'production' ? undefined : 'default_secret_key_development');
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || (nodeEnv === 'production' ? undefined : 'default_refresh_secret_development');

  if (nodeEnv === 'production' && (!jwtSecret || !jwtRefreshSecret)) {
    throw new Error('FATAL SECURITY ERROR: JWT_SECRET dan JWT_REFRESH_SECRET harus diset di production environment!');
  }

  return {
    port: parseInt(process.env.PORT || '4000', 10),
    nodeEnv,
    databaseUrl: process.env.DATABASE_URL,
    jwt: {
      secret: jwtSecret,
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      refreshSecret: jwtRefreshSecret,
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    cors: {
      origins: (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000,https://icms-campus.vercel.app').split(','),
    },
    paymentSandbox: process.env.PAYMENT_SANDBOX_MODE === 'true',
  };
};

