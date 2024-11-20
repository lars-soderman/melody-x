import { createDefaultProject } from '@/constants';
import { AppProject } from '@/types';
import { useEffect, useState } from 'react';

const LOCAL_STORAGE_KEY = 'melody-x-demo-project';

const DEFAULT_PROJECT = createDefaultProject('Demo Project', 'demo');

export function useLocalProject() {
  const [project, setProject] = useState<AppProject>(DEFAULT_PROJECT);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setProject(JSON.parse(stored));
    }
  }, []);

  const updateLocalProject = (updates: Partial<AppProject>) => {
    const updated = { ...project, ...updates };
    setProject(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  return { project, updateLocalProject };
}
