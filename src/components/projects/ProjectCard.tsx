'use client';

import { AppProject } from '@/types';
import { useRouter } from 'next/navigation';

type Props = {
  project: AppProject;
};

export function ProjectCard({ project }: Props) {
  const router = useRouter();

  return (
    <div
      className="cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
      onClick={() => router.push(`/editor/${project.id}`)}
    >
      <h3 className="mb-2 font-semibold">{project.name}</h3>

      <div className="mb-4 text-sm text-gray-600">
        Created {new Date(project.createdAt).toLocaleDateString()}
      </div>

      {project.collaborators && project.collaborators.length > 0 && (
        <div className="text-sm text-gray-500">
          <div className="mb-1">Shared with:</div>
          <div className="flex flex-wrap gap-1">
            {project.collaborators.map((collab) => (
              <span
                key={collab.user_id}
                className="rounded-full bg-gray-100 px-2 py-1 text-xs"
              >
                {collab.user?.email}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
