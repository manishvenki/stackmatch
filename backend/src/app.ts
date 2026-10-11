import express, { Express } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config/environment';

// Cached database connection promise for serverless environments (e.g. Vercel)
let dbConnectionPromise: Promise<typeof mongoose> | null = null;

const ensureDatabaseConnected = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  if (!config.mongodbUri) {
    return;
  }
  if (!dbConnectionPromise) {
    dbConnectionPromise = mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 8000,
      dbName: 'stackmatch',
    }).catch((err: any) => {
      dbConnectionPromise = null;
      console.warn(`[Database] MongoDB Atlas connection notice (${err.message})`);
      return mongoose;
    });
  }
  await dbConnectionPromise;
};

export const createApp = (): Express => {
  const app = express();

  // Normalize rewritten Vercel internal paths to preserve the real requested route
  app.use((req, res, next) => {
    const matchedPath = (req.headers['x-matched-path'] || req.headers['x-vercel-matched-path'] || req.headers['x-forwarded-uri']) as string;
    if (matchedPath && (req.url.startsWith('/backend/src/app') || req.url.startsWith('/src/app'))) {
      req.url = matchedPath;
    }
    next();
  });

  // Lazy database connection middleware for serverless invocations
  app.use(async (req, res, next) => {
    try {
      await ensureDatabaseConnected();
    } catch (_) {}
    next();
  });

  // Production CORS Configuration
  const allowedOrigins = [
    'https://stackmatch-si37.vercel.app',
    'https://stackmatch.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    ...(config.clientUrl ? [config.clientUrl] : [])
  ];

  const isOriginAllowed = (origin: string): boolean => {
    if (allowedOrigins.includes(origin)) {
      return true;
    }
    // Allow Vercel preview deployments for StackMatch
    if (
      origin.startsWith('https://stackmatch-') &&
      origin.endsWith('.vercel.app')
    ) {
      return true;
    }
    // Allow localhost with any port in local development
    if (/^https?:\/\/localhost(:\d+)?$/.test(origin) || /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
      return true;
    }
    return false;
  };

  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server, or Postman)
      if (!origin) {
        return callback(null, true);
      }
      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400,
    optionsSuccessStatus: 204
  };

  // CORS middleware before any API routes
  app.use(cors(corsOptions));
  // Explicitly handle OPTIONS preflight requests for all endpoints
  app.options('*', cors(corsOptions));

  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Basic request logger in development
  if (config.nodeEnv !== 'test') {
    app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        if (req.path !== '/health') {
          console.log(`[${req.method}] ${req.path} -> ${res.statusCode} (${duration}ms)`);
        }
      });
      next();
    });
  }

  // Root route for deployment verification
  app.get('/', (req, res) => {
    res.json({
      service: 'StackMatch Backend API',
      status: 'online',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/health',
        apiHealth: '/api/v1/health',
        auth: '/api/v1/auth',
        projects: '/api/v1/projects'
      }
    });
  });

  // Health checks
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'stackmatch-backend',
      timestamp: new Date().toISOString()
    });
  });

  app.get('/api/v1/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'stackmatch-backend',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // API Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/projects', projectRoutes);

  // 404 Catch-all
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: `Route not found: ${req.method} ${req.originalUrl}`
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};

// Instantiate singleton Express application for serverless invocation
const app = createApp();

// Dual export for ES module and CommonJS compatibility with Vercel and local runners
export { app };
export default app;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = app;
  (module.exports as any).default = app;
  (module.exports as any).app = app;
  (module.exports as any).createApp = createApp;
}

