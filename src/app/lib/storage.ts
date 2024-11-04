import { Project } from '@/types';

const STORAGE_PREFIX = 'melody-x';
const STORAGE_INDEX = `${STORAGE_PREFIX}:index`;
const getProjectKey = (name: string, id: string) =>
  `${STORAGE_PREFIX}:project:${name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${id}`;

interface StorageIndex {
  lastSelectedId?: string;
  projectIds: string[];
}

export const storage = {
  getProjectIds: (): string[] => {
    try {
      const indexData = localStorage.getItem(STORAGE_INDEX);
      const index: StorageIndex = indexData
        ? JSON.parse(indexData)
        : { projectIds: [] };
      return index.projectIds;
    } catch (e) {
      console.error('Error getting project IDs:', e);
      return [];
    }
  },

  getLastSelectedProjectId: (): string | null => {
    try {
      const indexData = localStorage.getItem(STORAGE_INDEX);
      const index: StorageIndex = indexData
        ? JSON.parse(indexData)
        : { projectIds: [] };
      return index.lastSelectedId || null;
    } catch (e) {
      console.error('Error getting last selected project:', e);
      return null;
    }
  },

  getProject: (id: string): Project | null => {
    try {
      const projectKey = Object.keys(localStorage).find(
        (key) =>
          key.startsWith(`${STORAGE_PREFIX}:project:`) && key.endsWith(id)
      );
      if (!projectKey) return null;

      const data = localStorage.getItem(projectKey);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error getting project:', e);
      return null;
    }
  },

  saveProject: (project: Project): void => {
    try {
      const existingKeys = Object.keys(localStorage).filter(
        (key) =>
          key.startsWith(`${STORAGE_PREFIX}:project:`) &&
          key.includes(project.id)
      );

      existingKeys.forEach((key) => localStorage.removeItem(key));

      const projectKey = getProjectKey(project.name, project.id);
      localStorage.setItem(
        projectKey,
        JSON.stringify({
          ...project,
          modifiedAt: new Date().toISOString(),
        })
      );

      const indexData = localStorage.getItem(STORAGE_INDEX);
      const index: StorageIndex = indexData
        ? JSON.parse(indexData)
        : { projectIds: [] };

      if (!index.projectIds.includes(project.id)) {
        index.projectIds.push(project.id);
      }
      localStorage.setItem(STORAGE_INDEX, JSON.stringify(index));
    } catch (e) {
      console.error('Error saving project:', e);
    }
  },

  setLastSelectedProjectId: (id: string): void => {
    try {
      const indexData = localStorage.getItem(STORAGE_INDEX);
      const index: StorageIndex = indexData
        ? JSON.parse(indexData)
        : { projectIds: [] };

      index.lastSelectedId = id;
      localStorage.setItem(STORAGE_INDEX, JSON.stringify(index));
    } catch (e) {
      console.error('Error setting last selected project:', e);
    }
  },

  deleteProject: (id: string): void => {
    try {
      const projectKey = Object.keys(localStorage).find(
        (key) =>
          key.startsWith(`${STORAGE_PREFIX}:project:`) && key.endsWith(id)
      );
      if (projectKey) {
        localStorage.removeItem(projectKey);
      }

      const indexData = localStorage.getItem(STORAGE_INDEX);
      const index: StorageIndex = indexData
        ? JSON.parse(indexData)
        : { projectIds: [] };

      index.projectIds = index.projectIds.filter((pid) => pid !== id);
      if (index.lastSelectedId === id) {
        index.lastSelectedId = index.projectIds[0];
      }
      localStorage.setItem(STORAGE_INDEX, JSON.stringify(index));
    } catch (e) {
      console.error('Error deleting project:', e);
    }
  },
};
