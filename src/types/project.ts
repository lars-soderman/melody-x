import type { Box, Hint } from '@/types';
import type { User } from '@prisma/client';

export type GridData = {
  boxes: Box[];
  cols: number;
  font: string;
  rows: number;
};

// Database/Prisma types
export type PrismaProject = {
  createdAt: Date;
  gridData: GridData;
  hints: Hint[];
  id: string;
  isPublic: boolean | null;
  name: string;
  owner: User;
  ownerId: string;
  updatedAt: Date;
};

export type PrismaSharedProject = {
  addedAt: Date | null;
  addedById: string | null;
  project: PrismaProject & {
    owner: User;
  };
  projectId: string;
  user: User;
  userId: string;
};

// Input types for actions
export type CreateProjectInput = {
  gridData: {
    boxes: Box[];
    cols: number;
    font: string;
    rows: number;
  };
  hints?: Hint[];
  isPublic?: boolean;
  name: string;
  ownerId: string;
};

export type UpdateProjectInput = Partial<
  Omit<CreateProjectInput, 'ownerId'> & {
    gridData?: {
      boxes?: Box[];
      cols?: number;
      font?: string;
      rows?: number;
    };
  }
>;
