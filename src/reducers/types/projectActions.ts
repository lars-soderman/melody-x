import { Project } from '@/types';

export type ProjectsState = {
  currentProjectId: string;
  projects: Project[];
};

export type ProjectsAction =
  | { type: 'LOAD_PROJECTS' }
  | { name: string; type: 'CREATE_PROJECT' }
  | { project: Project; type: 'UPDATE_PROJECT' }
  | { id: string; type: 'DELETE_PROJECT' }
  | { id: string; type: 'SELECT_PROJECT' }
  | { project: Project; type: 'IMPORT_PROJECT' };
