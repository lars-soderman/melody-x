import { Project } from '@/types';

export type ProjectsState = {
  currentProjectId: string | null;
  isLoading: boolean;
  ownedProjects: Project[];
  projects: Project[];
  sharedProjects: Project[];
};

export type ProjectsAction =
  | {
      ownedProjects: Project[];
      sharedProjects: Project[];
      type: 'LOAD_PROJECTS';
    }
  | { project: Project; type: 'CREATE_PROJECT' }
  | { project: Project; type: 'UPDATE_PROJECT' }
  | { id: string; type: 'DELETE_PROJECT' }
  | { id: string; type: 'SELECT_PROJECT' }
  | { project: Project; type: 'IMPORT_PROJECT' };
