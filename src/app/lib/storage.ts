import { Project } from '@/types';

// Constants for storage keys
const STORAGE_PREFIX = 'melody-x';
const STORAGE_INDEX = `${STORAGE_PREFIX}:index`;
const getProjectKey = (name: string, id: string) =>
  `${STORAGE_PREFIX}:project:${name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${id}`;

interface StorageIndex {
  lastSelectedId?: string;
  projectIds: string[];
}

// Add this helper function to find a project's storage key
const findProjectKey = (id: string): string | null => {
  const key = Object.keys(localStorage).find(
    (key) => key.startsWith(`${STORAGE_PREFIX}:project:`) && key.endsWith(id)
  );
  return key || null;
};

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
      // Find project by ID pattern
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

  saveProject: (project: Project, oldName?: string): void => {
    console.log('Saving project:', { id: project.id, name: project.name });
    try {
      // Find and remove any existing entries for this ID first
      const existingKeys = Object.keys(localStorage).filter(
        (key) =>
          key.startsWith(`${STORAGE_PREFIX}:project:`) &&
          key.includes(project.id)
      );
      console.log('Existing storage keys:', existingKeys);

      existingKeys.forEach((key) => localStorage.removeItem(key));

      // Save project with new name
      const projectKey = getProjectKey(project.name, project.id);
      localStorage.setItem(
        projectKey,
        JSON.stringify({
          ...project,
          modifiedAt: new Date().toISOString(),
        })
      );

      // Update index
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
      // Find and remove project by ID pattern
      const projectKey = Object.keys(localStorage).find(
        (key) =>
          key.startsWith(`${STORAGE_PREFIX}:project:`) && key.endsWith(id)
      );
      if (projectKey) {
        localStorage.removeItem(projectKey);
      }

      // Update index
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
