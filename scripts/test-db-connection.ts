// const { PrismaClient } = require('@prisma/client');

// async function testConnection() {
//   const prisma = new PrismaClient({
//     log: ['query', 'info', 'warn', 'error'],
//   });

//   try {
//     console.log('Testing database connection...');
//     await prisma.$connect();
//     console.log('Successfully connected to database!');

//     // Try a simple query
//     const result = await prisma.$queryRaw`SELECT NOW()`;
//     console.log('Query result:', result);
//   } catch (error) {
//     console.error('Failed to connect:', error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// testConnection();
