'use server';

import { mapProjectFromDB } from '@/lib/mappers';
import { prisma } from '@/lib/prisma';
import { createServerClient } from '@/lib/supabase-server';
import { AppProject, Box, Hint } from '@/types';
import { CreateProjectInput, GridData } from '@/types/project';
import { revalidatePath } from 'next/cache';

export async function createProject(
  data: CreateProjectInput
): Promise<AppProject> {
  try {
    const supabase = createServerClient();
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (!supabaseUser) {
      throw new Error('Not authenticated');
    }

    // Assume user exists in DB since we create it in auth callback
    const project = await prisma.project.create({
      data: {
        ...data,
        ownerId: supabaseUser.id,
      },
      include: {
        owner: true,
      },
    });

    revalidatePath('/');
    return mapProjectFromDB(project);
  } catch (error) {
    console.error('Create project error:', error);
    throw error;
  }
}

export async function updateProject(
  projectId: string,
  data: {
    boxes?: Box[];
    cols?: number;
    font?: string;
    hints?: Hint[];
    isPublic?: boolean;
    name?: string;
    rows?: number;
  }
) {
  try {
    // If only updating name, use simple update
    if (Object.keys(data).length === 1 && 'name' in data) {
      return await prisma.project.update({
        where: { id: projectId },
        data: { name: data.name },
        include: {
          owner: true,
        },
      });
    }

    // For grid updates, reconstruct the gridData object
    const gridData: Partial<GridData> = {};
    if (data.boxes) gridData.boxes = data.boxes;
    if (data.cols) gridData.cols = data.cols;
    if (data.rows) gridData.rows = data.rows;
    if (data.font) gridData.font = data.font;

    const updateData: {
      gridData?: GridData;
      hints?: Hint[];
      isPublic?: boolean;
      name?: string;
    } = {};

    if (Object.keys(gridData).length > 0) {
      updateData.gridData = gridData as GridData;
    }
    if (data.hints) updateData.hints = data.hints;
    if (data.name) updateData.name = data.name;
    if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
      include: {
        owner: true,
      },
    });

    // Remove revalidatePath call since we don't want to trigger a re-render
    // revalidatePath(`/editor/${projectId}`);
    return updatedProject;
  } catch (error) {
    console.error('Update project error:', error);
    throw error;
  }
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
  revalidatePath('/');
}

export async function getProjects(userId: string): Promise<AppProject[]> {
  console.log('🔍 getProjects - userId:', userId);

  try {
    // Debug check for user in our DB
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    console.log('🔍 DB User state:', dbUser);

    // If no projects found, that's fine - return empty array
    const prismaProjects = await prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        owner: true,
      },
    });

    console.log('🔍 Found projects:', prismaProjects);
    return prismaProjects.map(mapProjectFromDB);
  } catch (error) {
    console.error('❌ Error in getProjects:', error);
    // Instead of throwing, return empty array to prevent 500
    return [];
  }
}
