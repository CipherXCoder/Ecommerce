import app from './app.js';
import { prismaClient } from './db/prisma.js';
import { PORT } from './config/secrets.js';

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception', err);
  process.exit(1);
});
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection', err);
  process.exit(1);
});

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV ?? 'development'} mode on port ${PORT}`);
});

// Graceful shutdown (close HTTP server and disconnect Prisma)
for (const sig of ['SIGINT', 'SIGTERM'] as const) {
  process.on(sig, async () => {
    console.log(`${sig} received, shutting down gracefully…`);
    server.close(async (err?: Error) => {
      if (err) console.error('Error closing HTTP server', err);

      try {
        await prismaClient.$disconnect();
        console.log('Prisma disconnected.');
      } catch (dbErr) {
        console.error('Error disconnecting Prisma', dbErr);
      } finally {
        process.exit(0);
      }
    });
  });
}