'use client';

import { getProjects } from '@/app/actions';
import { useAuth } from '@/contexts/AuthContext';
import type { AppProject } from '@/types';
import { useEffect, useState } from 'react';
import { ProjectList } from './ProjectList';

type Props = {
  userId: string;
};

export function ProjectListWrapper({ userId }: Props) {
  const [projects, setProjects] = useState<AppProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { signOut } = useAuth();

  useEffect(() => {
    async function loadProjects() {
      try {
        setIsLoading(true);
        const userProjects = await getProjects(userId);
        setProjects(userProjects);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (userId) {
      loadProjects();
    }
  }, [userId]);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        {/* <SignOutButton /> */}
      </div>
      {isLoading ? (
        <div>Loading projects...</div>
      ) : (
        <ProjectList projects={projects} userId={userId} />
      )}
    </>
  );
}
