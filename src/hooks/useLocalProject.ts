import { createDefaultProject } from '@/constants';
import { AppProject } from '@/types';
import { useEffect, useState } from 'react';

export function useLocalProject(storageKey: string, projectName: string) {
  const [project, setProject] = useState<AppProject | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    setProject(
      stored ? JSON.parse(stored) : createDefaultProject(projectName, 'demo')
    );
  }, [projectName, storageKey]);

  const updateProject = (updatedProject: AppProject) => {
    setProject(updatedProject);
    localStorage.setItem(storageKey, JSON.stringify(updatedProject));
  };

  return { project, updateProject };
}
