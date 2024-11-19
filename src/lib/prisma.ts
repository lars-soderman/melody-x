import { PrismaClient } from '@prisma/client';

// Declare the global type
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create a new PrismaClient if one doesn't exist
const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

// In development, save the client to the global object to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export { prisma };
