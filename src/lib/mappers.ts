import type { Project } from '@/types';
import type { Prisma } from '@prisma/client';

// Define the exact type that Prisma returns
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
): Project {
  const gridData = dbProject.gridData as {
    boxes: Array<{
      arrowDown?: boolean;
      arrowRight?: boolean;
      black?: boolean;
      col: number;
      hint?: number;
      letter?: string;
      row: number;
      stopDown?: boolean;
      stopRight?: boolean;
    }>;
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
    hints: (dbProject.hints as any[]) || [],
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
