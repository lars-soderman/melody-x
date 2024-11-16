'use client';

import { AuthButton } from '@/app/components/AuthButton';
import { ProjectCard } from '@/app/components/ProjectCard';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/useProjects';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const { loadProjects, projects, createProject, deleteProject } =
    useProjects();

  const { user } = useAuth();

  useEffect(() => {
    const init = async () => {
      await loadProjects();
      setIsLoading(false);
    };
    init();
  }, [loadProjects]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newProjectName.trim();
    if (trimmedName) {
      await createProject(trimmedName);
      setIsCreating(false);
      setNewProjectName('');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="gap-4">
          <h1 className="text-2xl font-bold">Melodikryss</h1>
          <div className="mt-8">
            <AuthButton />
          </div>
        </div>
        {user && (
          <button
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={() => setIsCreating(true)}
          >
            New Project
          </button>
        )}
      </div>

      {isCreating && (
        <form className="mb-6" onSubmit={handleCreateProject}>
          <input
            autoFocus
            className="mr-2 rounded border border-gray-200 p-2"
            placeholder="Project name"
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            type="submit"
          >
            Create
          </button>
        </form>
      )}

      {projects.length === 0 ? (
        <p className="text-gray-600"></p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={() => deleteProject(project.id)}
              onRename={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
