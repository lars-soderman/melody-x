'use server';

import { mapProjectFromDB } from '@/lib/mappers';
import { prisma } from '@/lib/prisma';
import { AppProject } from '@/types';
import { CreateProjectInput } from '@/types/project';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

type UserMetadata = {
  [key: string]: string | number | boolean | null;
};

export async function createProject(data: CreateProjectInput) {
  try {
    // First, ensure the user exists
    const user = await prisma.user.findUnique({
      where: { id: data.ownerId },
    });

    if (!user) {
      // Get the user's email from Supabase
      const supabase = createRouteHandlerClient({ cookies: () => cookies() });
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();

      if (!supabaseUser) {
        throw new Error('User not authenticated');
      }

      // Create the user in our database with required fields
      await prisma.user.create({
        data: {
          id: data.ownerId,
          email: supabaseUser.email!,
          rawUserMetaData: (supabaseUser.user_metadata as UserMetadata) || {},
        },
      });
    }

    // Now create the project
    const project = await prisma.project.create({
      data: {
        name: data.name,
        gridData: data.gridData,
        hints: data.hints || [],
        isPublic: data.isPublic,
        owner: {
          connect: { id: data.ownerId },
        },
      },
      include: {
        owner: true,
        collaborators: {
          include: { user: true },
        },
      },
    });

    revalidatePath('/');
    return project;
  } catch (error) {
    console.error('Create project error:', error);
    throw error;
  }
}

export async function updateProject(
  projectId: string,
  data: Partial<AppProject>
) {
  try {
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        gridData: {
          boxes: data.boxes,
          cols: data.cols,
          rows: data.rows,
          font: data.font,
        },
        hints: data.hints,
        name: data.name,
        updatedAt: new Date(),
      },
      include: {
        owner: true,
        collaborators: {
          include: {
            user: true,
          },
        },
      },
    });

    revalidatePath('/');
    revalidatePath(`/project/${projectId}`);

    return project;
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
  revalidatePath('/');
}

export async function signOut() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  await supabase.auth.signOut();

  // Clear all auth-related cookies
  const cookiesToClear = [
    'sb-access-token',
    'sb-refresh-token',
    'sb-auth-token',
  ];

  cookiesToClear.forEach((name) => {
    cookieStore.set(name, '', {
      expires: new Date(0),
      maxAge: 0,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  });

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function handleAuthStateChange(
  event: AuthChangeEvent,
  session: Session | null
) {
  const cookieStore = cookies();

  if (event === 'SIGNED_OUT') {
    // Clear auth cookies
    cookieStore.set('sb-auth-token', '', { maxAge: 0 });
    cookieStore.set('sb-refresh-token', '', { maxAge: 0 });
  } else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
    if (session) {
      // Set auth cookies
      cookieStore.set('sb-auth-token', session.access_token, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      if (session.refresh_token) {
        cookieStore.set('sb-refresh-token', session.refresh_token, {
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
      }
    }
  }
}

export async function getProjects(userId: string): Promise<AppProject[]> {
  if (!userId) return [];

  try {
    const prismaProjects = await prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        owner: true,
        collaborators: {
          include: {
            user: true,
          },
        },
      },
    });

    return prismaProjects.map(mapProjectFromDB);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}
