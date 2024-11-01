import { Project } from '@/types';

const PROJECT_INDEX_KEY = 'melody-x-project-index';
const PROJECT_PREFIX = 'melody-x-project-';

export const storage = {
  getProjectIds: (): string[] => {
    const index = localStorage.getItem(PROJECT_INDEX_KEY);
    return index ? JSON.parse(index) : [];
  },

  getProject: (id: string): Project | null => {
    // Find the project name from the index
    const projectKeys = Object.keys(localStorage).filter(
      (key) => key.startsWith(PROJECT_PREFIX) && key.includes(id)
    );
    if (projectKeys.length === 0) return null;

    const data = localStorage.getItem(projectKeys[0]);
    return data ? JSON.parse(data) : null;
  },

  saveProject: (project: Project): void => {
    // Create a storage key with both ID and name
    const safeProjectName = project.name
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase();
    const storageKey = `${PROJECT_PREFIX}${project.id}-${safeProjectName}`;

    // Save project
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        ...project,
        modifiedAt: new Date().toISOString(),
      })
    );

    // Update index if needed
    const ids = storage.getProjectIds();
    if (!ids.includes(project.id)) {
      ids.push(project.id);
      localStorage.setItem(PROJECT_INDEX_KEY, JSON.stringify(ids));
    }
  },

  deleteProject: (id: string): void => {
    // Find and remove the project by ID pattern
    const projectKeys = Object.keys(localStorage).filter(
      (key) => key.startsWith(PROJECT_PREFIX) && key.includes(id)
    );
    projectKeys.forEach((key) => localStorage.removeItem(key));

    // Update index
    const ids = storage.getProjectIds().filter((pid) => pid !== id);
    localStorage.setItem(PROJECT_INDEX_KEY, JSON.stringify(ids));
  },
};
