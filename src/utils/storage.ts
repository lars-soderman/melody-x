import { Project } from '@/types';

const STORAGE_PREFIX = 'melody-x';
const STORAGE_INDEX = `${STORAGE_PREFIX}:index`;
const getProjectKey = (name: string, id: string) =>
  `${STORAGE_PREFIX}:project:${name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${id}`;

interface StorageIndex {
  lastSelectedId?: string;
  projectIds: string[];
}

const MIN_PROJECT_CREATE_INTERVAL = 1000; // 1 second
let lastProjectCreationTime = 0;

const canCreateProject = (): boolean => {
  const now = Date.now();
  if (now - lastProjectCreationTime < MIN_PROJECT_CREATE_INTERVAL) {
    return false;
  }
  lastProjectCreationTime = now;
  return true;
};

// Type for our storage manager
type StorageManager = {
  data: Record<string, string>;
  persist: boolean;
};

// Single storage manager instance
const storageManager: StorageManager = {
  data: {},
  persist: false, // Will be set to true if localStorage is available
};

// Add near the top with other constants
let FORCE_STORAGE_UNAVAILABLE = false;

// Initialize storage manager
const initStorage = () => {
  if (FORCE_STORAGE_UNAVAILABLE) {
    storageManager.persist = false;
    return;
  }

  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    storageManager.persist = true;

    // Load existing data from localStorage if available
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        storageManager.data[key] = localStorage.getItem(key) || '';
      }
    });
  } catch (e) {
    storageManager.persist = false;
  }
};

// Initialize on import
initStorage();

export const storage = {
  getItem: (key: string): string | null => {
    return storageManager.data[key] || null;
  },

  setItem: (key: string, value: string): void => {
    storageManager.data[key] = value;
    if (storageManager.persist) {
      localStorage.setItem(key, value);
    }
  },

  removeItem: (key: string): void => {
    delete storageManager.data[key];
    if (storageManager.persist) {
      localStorage.removeItem(key);
    }
  },

  getProjectIds: (): string[] => {
    const indexData = storage.getItem(STORAGE_INDEX);
    const index: StorageIndex = indexData
      ? JSON.parse(indexData)
      : { projectIds: [] };
    return index.projectIds;
  },

  getLastSelectedProjectId: (): string | null => {
    const indexData = storage.getItem(STORAGE_INDEX);
    const index: StorageIndex = indexData
      ? JSON.parse(indexData)
      : { projectIds: [] };
    return index.lastSelectedId || null;
  },

  setLastSelectedProjectId: (id: string): void => {
    const indexData = storage.getItem(STORAGE_INDEX);
    const index: StorageIndex = indexData
      ? JSON.parse(indexData)
      : { projectIds: [] };

    index.lastSelectedId = id;
    storage.setItem(STORAGE_INDEX, JSON.stringify(index));
  },

  getProject: (id: string): Project | null => {
    try {
      // Find project by ID in all stored projects
      const key = Object.keys(storageManager.data).find(
        (key) =>
          key.startsWith(`${STORAGE_PREFIX}:project:`) && key.includes(id)
      );
      if (!key) return null;

      const data = storage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error getting project:', e);
      return null;
    }
  },

  saveProject: (project: Project): boolean => {
    try {
      if (!project.id.includes('new-') && !canCreateProject()) {
        return false;
      }

      const projectKey = getProjectKey(project.name, project.id);
      storage.setItem(projectKey, JSON.stringify(project));

      // Update index
      const indexData = storage.getItem(STORAGE_INDEX);
      const index: StorageIndex = indexData
        ? JSON.parse(indexData)
        : { projectIds: [] };

      if (!index.projectIds.includes(project.id)) {
        index.projectIds.push(project.id);
        storage.setItem(STORAGE_INDEX, JSON.stringify(index));
      }

      return true;
    } catch (e) {
      console.error('Error saving project:', e);
      return false;
    }
  },

  deleteProject: (id: string): void => {
    try {
      // Find and remove project data
      const projectKey = Object.keys(storageManager.data).find(
        (key) =>
          key.startsWith(`${STORAGE_PREFIX}:project:`) && key.includes(id)
      );
      if (projectKey) {
        storage.removeItem(projectKey);
      }

      // Update index
      const indexData = storage.getItem(STORAGE_INDEX);
      const index: StorageIndex = indexData
        ? JSON.parse(indexData)
        : { projectIds: [] };

      index.projectIds = index.projectIds.filter((pid) => pid !== id);
      if (index.lastSelectedId === id) {
        delete index.lastSelectedId;
      }

      storage.setItem(STORAGE_INDEX, JSON.stringify(index));
    } catch (e) {
      console.error('Error deleting project:', e);
    }
  },

  setStorageAvailable: (available: boolean) => {
    FORCE_STORAGE_UNAVAILABLE = !available;
    if (FORCE_STORAGE_UNAVAILABLE) {
      storageManager.persist = false;
    } else {
      // Re-run initialization to check actual availability
      initStorage();
    }
  },

  isStorageAvailable: () => {
    return !FORCE_STORAGE_UNAVAILABLE && storageManager.persist;
  },
};
