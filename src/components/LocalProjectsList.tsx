'use client';

import { CreateLocalProjectButton } from '@/components/projects/CreateLocalProjectButton';
import { ImportProjectButton } from '@/components/projects/ImportProjectButton';
import { LocalProjectCard } from '@/components/projects/LocalProjectCard';
import { useLocalProjects } from '@/hooks/useLocalProjects';

export function LocalProjectsList() {
  const { projects, create, remove, update, isLoading } = useLocalProjects();

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <ImportProjectButton onImport={update} />
        <CreateLocalProjectButton onCreate={create} />
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
