'use client';

import { createDefaultProject } from '@/constants';
import { AppProject } from '@/types';
import { useCallback, useEffect, useState } from 'react';

interface LocalProjectsMetadata {
  lastSelectedId: string | null;
  projectIds: string[];
}

const PROJECT_PREFIX = 'melody-x-project-';

export function useLocalProjects() {
  const [projects, setProjects] = useState<AppProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProjects = useCallback(() => {
    // Get all localStorage keys
    const allKeys = Object.keys(localStorage);
    // Filter for project keys
    const projectKeys = allKeys.filter((key) => key.startsWith(PROJECT_PREFIX));

    // Load all projects
    const loadedProjects = projectKeys
      .map((key) => {
        const projectStr = localStorage.getItem(key);
        return projectStr ? JSON.parse(projectStr) : null;
      })
      .filter((p): p is AppProject => p !== null);

    console.log('Loaded local projects:', loadedProjects);
    setProjects(loadedProjects);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const create = useCallback((name: string) => {
    const timestamp = Date.now();
    const ownerId = `new-${timestamp}`;
    const newProject = createDefaultProject(name, ownerId);

    localStorage.setItem(
      `${PROJECT_PREFIX}${ownerId}`,
      JSON.stringify(newProject)
    );

    setProjects((prev) => [...prev, newProject]);
    return newProject;
  }, []);

  const update = useCallback((project: AppProject) => {
    localStorage.setItem(
      `${PROJECT_PREFIX}${project.owner_id}`,
      JSON.stringify(project)
    );

    setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)));
  }, []);

  const remove = useCallback((id: string) => {
    setProjects((prev) => {
      const projectToRemove = prev.find((p) => p.id === id);
      if (projectToRemove) {
        localStorage.removeItem(`${PROJECT_PREFIX}${projectToRemove.owner_id}`);
      }
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  return {
    projects,
    isLoading,
    create,
    update,
    remove,
  };
}
