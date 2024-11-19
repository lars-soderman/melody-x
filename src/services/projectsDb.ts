// import { mapProjectFromDB } from '@/lib/mappers';
// import { prisma } from '@/lib/prisma';
// import type { CreateProjectInput, UpdateProjectInput } from '@/types/project';

// export async function getSharedProjects(userId: string) {
//   return prisma.projectCollaborator.findMany({
//     where: {
//       userId,
//     },
//     include: {
//       project: {
//         include: {
//           owner: true,
//         },
//       },
//     },
//   });
// }

// export async function getOwnedProjects(userId: string) {
//   return prisma.project.findMany({
//     where: {
//       ownerId: userId,
//     },
//     include: {
//       owner: true,
//       collaborators: {
//         include: {
//           user: true,
//         },
//       },
//     },
//   });
// }

// export async function createProjectDB(data: CreateProjectInput) {
//   return prisma.project.create({
//     data: {
//       name: data.name,
//       gridData: data.gridData,
//       hints: data.hints || [],
//       isPublic: data.isPublic,
//       owner: {
//         connect: {
//           id: data.ownerId,
//         },
//       },
//     },
//     include: {
//       owner: true,
//       collaborators: {
//         include: {
//           user: true,
//         },
//       },
//     },
//   });
// }

// export async function getProjectDB(projectId: string) {
//   return prisma.project.findUnique({
//     where: {
//       id: projectId,
//     },
//     include: {
//       owner: true,
//       collaborators: {
//         include: {
//           user: true,
//         },
//       },
//     },
//   });
// }

// export async function updateProjectDB(
//   projectId: string,
//   data: UpdateProjectInput
// ) {
//   return prisma.project.update({
//     where: {
//       id: projectId,
//     },
//     data: {
//       name: data.name,
//       gridData: data.gridData,
//       hints: data.hints,
//       isPublic: data.isPublic,
//     },
//     include: {
//       owner: true,
//       collaborators: {
//         include: {
//           user: true,
//         },
//       },
//     },
//   });
// }

// export async function getProjectsByUser(userId: string) {
//   const projects = await prisma.project.findMany({
//     where: {
//       OR: [
//         { ownerId: userId },
//         {
//           collaborators: {
//             some: {
//               userId: userId,
//             },
//           },
//         },
//       ],
//     },
//     include: {
//       owner: true,
//       collaborators: {
//         include: {
//           user: true,
//         },
//       },
//     },
//   });

//   return projects.map(mapProjectFromDB);
// }
