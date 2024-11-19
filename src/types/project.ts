import { Project as PrismaProject, User } from '@prisma/client';

export type Project = {
  boxes: Array<{
    arrowDown?: boolean;
    arrowRight?: boolean;
    black?: boolean;
    col: number;
    hint?: number;
    letter?: string | null;
    row: number;
    stopDown?: boolean;
    stopRight?: boolean;
  }>;
  cols: number;
  createdAt: Date;
  font: string;
  gridData: any;
  hints: any;
  id: string;
  isPublic: boolean | null;
  name: string;
  owner: User;
  ownerId: string;
  rows: number;
  updatedAt: Date;
};

export function mapPrismaProjectToProject(
  prismaProject: PrismaProject & { owner: User }
): Project {
  return {
    ...prismaProject,
    ...(prismaProject.gridData as {
      boxes: Project['boxes'];
      cols: number;
      font: string;
      rows: number;
    }),
  };
}

export type CreateProjectInput = {
  gridData: {
    boxes: Array<{
      arrowDown?: boolean;
      arrowRight?: boolean;
      black?: boolean;
      col: number;
      hint?: number;
      letter?: string | null;
      row: number;
      stopDown?: boolean;
      stopRight?: boolean;
    }>;
    cols: number;
    font: string;
    rows: number;
  };
  hints?: Array<{
    boxId: string;
    direction: 'across' | 'down';
    id: string;
    length: number;
    number: number;
    text: string;
  }>;
  isPublic?: boolean;
  name: string;
  ownerId: string;
};

export type SharedProjectFromDB = {
  addedAt: Date | null;
  addedById: string | null;
  project: Project & {
    owner: User;
  };
  projectId: string;
  user: User;
  userId: string;
};

export type UpdateProjectInput = Partial<
  Omit<CreateProjectInput, 'ownerId'> & {
    gridData?: {
      boxes?: Array<{
        arrowDown?: boolean;
        arrowRight?: boolean;
        black?: boolean;
        col: number;
        hint?: number;
        letter?: string | null;
        row: number;
        stopDown?: boolean;
        stopRight?: boolean;
      }>;
      cols?: number;
      font?: string;
      rows?: number;
    };
  }
>;
