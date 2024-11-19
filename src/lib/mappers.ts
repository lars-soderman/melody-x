import type { AppProject, Box, Hint } from '@/types';
import type { Prisma } from '@prisma/client';

type PrismaProjectWithRelations = Prisma.ProjectGetPayload<{
  include: {
    collaborators: {
      include: {
        user: true;
      };
    };
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
    owner_id: dbProject.ownerId,
    isPublic: dbProject.isPublic || false,
    collaborators: dbProject.collaborators.map((collab) => ({
      added_at: collab.addedAt?.toISOString() || '',
      added_by: collab.addedById || '',
      project_id: collab.projectId,
      user_id: collab.userId,
      user: {
        email: collab.user.email || '',
        display_name:
          (collab.user.rawUserMetaData as { display_name: string })
            .display_name || '',
      },
    })),
  };
}
