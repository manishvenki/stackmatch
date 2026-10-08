import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config/environment';

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      // Allow localhost or configured client URL
      if (origin.startsWith('http://localhost') || origin === config.clientUrl) {
        return callback(null, true);
      }
      return callback(null, true); // Dev-friendly
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

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
