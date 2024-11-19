// const { PrismaClient } = require('@prisma/client');

// async function createInitialUser() {
//   const prisma = new PrismaClient({
//     log: ['query', 'info', 'warn', 'error'],
//   });

//   try {
//     console.log('Creating initial user...');

//     const user = await prisma.user.create({
//       data: {
//         id: '83f6865b-1ab6-4932-9992-b16387eb99a3', // Get this from Supabase Auth
//         email: 'lars.soderman@gmail.com', // Your email
//         rawUserMetaData: {
//           display_name: 'Your Name',
//         },
//       },
//     });

//     console.log('Successfully created user:', user);
//   } catch (err) {
//     console.error('Failed to create user:', err);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// createInitialUser();
