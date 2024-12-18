'use client';

import { ProjectCard } from '@/components/projects/ProjectCard';
import { AppProject } from '@/types';
import { CreateProjectButton } from './CreateProjectButton';

type Props = {
  projects: AppProject[];
  userId: string;
};

export function ProjectList({ projects, userId }: Props) {
  return (
    <div>
      <div className="mb-6 flex justify-start">
        <CreateProjectButton userId={userId} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <p className="text-gray-500">
            No projects yet. Create one to get started!
          </p>
        ) : (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>
    </div>
  );
}
