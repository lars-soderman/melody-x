import { AppProject } from '@/types';

export type ProjectsState = {
  currentProjectId: string | null;
  isLoading: boolean;
  ownedProjects: AppProject[];
  projects: AppProject[];
  sharedProjects: AppProject[];
};

export type ProjectsAction =
  | {
      ownedProjects: AppProject[];
      sharedProjects: AppProject[];
      type: 'LOAD_PROJECTS';
    }
  | { project: AppProject; type: 'CREATE_PROJECT' }
  | { project: AppProject; type: 'UPDATE_PROJECT' }
  | { id: string; type: 'DELETE_PROJECT' }
  | { id: string; type: 'SELECT_PROJECT' }
  | { project: AppProject; type: 'IMPORT_PROJECT' };
