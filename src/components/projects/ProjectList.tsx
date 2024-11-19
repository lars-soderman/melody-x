'use client';

import { AppProject } from '@/types';
import { CreateProjectButton } from './CreateProjectButton';
import { ProjectCard } from './ProjectCard';

type Props = {
  projects: AppProject[];
  userId: string;
};

export function ProjectList({ projects, userId }: Props) {
  return (
    <div>
      <div className="mb-6 flex justify-end">
        <CreateProjectButton userId={userId} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
