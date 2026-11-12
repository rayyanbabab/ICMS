// Serverless entrypoint for Vercel
// Environment variables are securely loaded from Vercel Project Settings

const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');
const helmet = require('helmet');
const { AppModule } = require('../apps/api/dist/app.module');
const { ValidationPipe } = require('@nestjs/common');
const { TransformInterceptor } = require('../apps/api/dist/common/interceptors/transform.interceptor');
const { AllExceptionsFilter } = require('../apps/api/dist/common/filters/all-exceptions.filter');

const server = express();
server.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
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

  const allowedOrigins = [
    'https://icms-campus.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Akses CORS ditolak'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
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
