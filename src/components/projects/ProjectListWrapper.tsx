'use client';

import { getProjects } from '@/app/actions';
import type { AppProject } from '@/types';
import { useEffect, useState } from 'react';
import { ProjectList } from './ProjectList';

type Props = {
  userId: string;
};

export function ProjectListWrapper({ userId }: Props) {
  const [projects, setProjects] = useState<AppProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      {isLoading ? (
        <div>Loading projects...</div>
      ) : (
        <ProjectList projects={projects} userId={userId} />
      )}
    </>
  );
}
