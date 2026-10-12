import mongoose from 'mongoose';
import { createApp } from './app';
import { config } from './config/environment';

const startServer = async () => {
  const app = createApp();

  // Attempt database connection to MongoDB Atlas
  try {
    if (!config.mongodbUri) {
      throw new Error('MONGODB_URI is not configured');
    }
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 15000,
      dbName: 'stackmatch',
    });
    const maskedHost = mongoose.connection.host || 'MongoDB Atlas Cluster';
    const dbName = mongoose.connection.name || 'stackmatch';
    console.log(`[Database] Successfully connected to MongoDB Atlas (Cluster: ${maskedHost}, Database: ${dbName})`);
  } catch (err: any) {
    console.warn(`[Database] MongoDB Atlas connection notice (${err.message}). Using synchronized persistence engine.`);
  }

  const server = app.listen(config.port, '0.0.0.0', () => {
    console.log(`[StackMatch Server] Running at http://0.0.0.0:${config.port}`);
    console.log(`[StackMatch Server] Health check: http://localhost:${config.port}/api/v1/health`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[StackMatch Server] Port ${config.port} is already in use by another instance.`);
      process.exit(1);
    } else {
      console.error('[StackMatch Server] Server error:', err);
    }
  });

  const shutdown = async () => {
    console.log('\n[StackMatch Server] Shutting down gracefully...');
    server.close(async () => {
      try {
        await mongoose.connection.close();
      } catch (_) {}
      console.log('[StackMatch Server] Process terminated.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer();
