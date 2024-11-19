// const { PrismaClient } = require('@prisma/client');

// async function createInitialUser() {
//   const prisma = new PrismaClient({
//     log: ['query', 'info', 'warn', 'error'],
//   });

//   try {
//     console.log('Creating initial user...');

//     const user = await prisma.user.create({
//       data: {
//         id: 'your-user-id-from-supabase', // Get this from Supabase Auth
//         email: 'your-email@example.com', // Your email
//         rawUserMetaData: {
//           display_name: 'Your Name',
//         },
//       },
//     });

//     console.log('Successfully created user:', user);
//   } catch (error) {
//     if (error.code === 'P2002') {
//       console.log('User already exists');
//     } else {
//       console.error('Failed to create user:', error);
//     }
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// createInitialUser();
