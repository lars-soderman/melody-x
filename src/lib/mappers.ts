import type { AppProject, Box, Hint } from '@/types';
import type { Prisma } from '@prisma/client';

type PrismaProjectWithRelations = Prisma.ProjectGetPayload<{
  include: {
    owner: true;
  };
}>;

export function mapProjectFromDB(
  dbProject: PrismaProjectWithRelations
): AppProject {
  const gridData = dbProject.gridData as {
    boxes: Box[];
    cols: number;
    font: string;
    rows: number;
  };

  return {
    id: dbProject.id,
    name: dbProject.name,
    createdAt: dbProject.createdAt.toISOString(),
    updatedAt: dbProject.updatedAt.toISOString(),
    boxes: gridData.boxes,
    cols: gridData.cols,
    rows: gridData.rows,
    font: gridData.font,
    hints: (dbProject.hints as Hint[]) || [],
    createdBy: dbProject.ownerId,
    owner: {
      id: dbProject.ownerId,
      email: dbProject.owner.email,
      rawUserMetaData: dbProject.owner,
    },
    isPublic: dbProject.isPublic || false,
  };
}
