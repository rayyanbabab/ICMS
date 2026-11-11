// Serverless entrypoint for Vercel
// Fallback environment variables for serverless execution
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    'postgresql://neondb_owner:npg_UTk4WDHi5XYl@ep-frosty-pond-b33ih75p-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=30';
}
if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL =
    'postgresql://neondb_owner:npg_UTk4WDHi5XYl@ep-frosty-pond-b33ih75p.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=30';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'icms_super_secure_jwt_secret_key_change_in_production_2026_xyz';
}
if (!process.env.JWT_REFRESH_SECRET) {
  process.env.JWT_REFRESH_SECRET = 'icms_super_secure_refresh_secret_key_change_in_production_2026_abc';
}

const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');
const { AppModule } = require('../apps/api/dist/app.module');
const { ValidationPipe } = require('@nestjs/common');
const { TransformInterceptor } = require('../apps/api/dist/common/interceptors/transform.interceptor');
const { AllExceptionsFilter } = require('../apps/api/dist/common/filters/all-exceptions.filter');

const server = express();
let isReady = false;
let initPromise = null;

// Middleware to normalize URL paths under Vercel rewrites
server.use((req, res, next) => {
  if (req.url === '/api/index.js' || req.url === '/api') {
    const original = req.headers['x-matched-path'] || req.originalUrl;
    if (original && original !== '/api/index.js') {
      req.url = original;
    }
  }
  if (!req.url.startsWith('/api/v1') && req.url.startsWith('/api/')) {
    req.url = req.url.replace('/api/', '/api/v1/');
  }
  next();
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['error', 'warn'],
  });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.init();
  isReady = true;
}

module.exports = async (req, res) => {
  if (!isReady) {
    if (!initPromise) {
      initPromise = bootstrap();
    }
    await initPromise;
  }
  return server(req, res);
};
