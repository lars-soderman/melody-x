'use client';

import { LocalProjectCard } from '@/components/projects/LocalProjectCard';
import { useLocalProjects } from '@/hooks/useLocalProjects';

export function LocalProjectsList() {
  const { projects, create, remove, isLoading } = useLocalProjects();
  console.log('LocalProjectsList projects:', projects);

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          onClick={() => create(`New Project ${projects.length + 1}`)}
        >
          Create New Local Project
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500">
          No local projects yet. Create one to get started!
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <LocalProjectCard
              key={project.id}
              project={project}
              onDelete={() => remove(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
