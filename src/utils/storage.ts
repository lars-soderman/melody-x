import { Project } from '@/types';

const PROJECT_INDEX_KEY = 'melody-x-project-index';
const PROJECT_PREFIX = 'melody-x-project-';

export const storage = {
  getProjectIds: (): string[] => {
    const index = localStorage.getItem(PROJECT_INDEX_KEY);
    return index ? JSON.parse(index) : [];
  },

  getProject: (id: string): Project | null => {
    const data = localStorage.getItem(`${PROJECT_PREFIX}${id}`);
    return data ? JSON.parse(data) : null;
  },

  saveProject: (project: Project): void => {
    // Save project
    localStorage.setItem(
      `${PROJECT_PREFIX}${project.id}`,
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
    localStorage.removeItem(`${PROJECT_PREFIX}${id}`);
    const ids = storage.getProjectIds().filter((pid) => pid !== id);
    localStorage.setItem(PROJECT_INDEX_KEY, JSON.stringify(ids));
  },
};
