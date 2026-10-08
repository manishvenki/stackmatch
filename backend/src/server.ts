import mongoose from 'mongoose';
import { createApp } from './app';
import { config } from './config/environment';

const startServer = async () => {
  const app = createApp();

  // Attempt database connection with graceful fallback
  try {
    const mongoTimeoutMs = 1500;
    await Promise.race([
      mongoose.connect(config.mongodbUri),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timed out')), mongoTimeoutMs)
      )
    ]);
    console.log(`[Database] Connected to MongoDB at ${config.mongodbUri}`);
  } catch (err: any) {
    console.warn(`[Database] MongoDB not reachable (${err.message}). Using synchronized persistence engine.`);
  }

  const server = app.listen(config.port, () => {
    console.log(`[StackMatch Server] Running at http://localhost:${config.port}`);
    console.log(`[StackMatch Server] Health check: http://localhost:${config.port}/api/v1/health`);
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
