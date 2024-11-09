import { createDefaultProject } from '@/constants';
import { Project } from '@/types';
import { storage } from '@/utils/storage';
import { ProjectsAction, ProjectsState } from './types/projectActions';

export const projectsReducer = (
  state: ProjectsState,
  action: ProjectsAction
): ProjectsState => {
  switch (action.type) {
    case 'LOAD_PROJECTS': {
      const projectIds = storage.getProjectIds();
      let projects: Project[] = [];

      if (projectIds.length > 0) {
        projects = projectIds
          .map((id) => storage.getProject(id))
          .filter((p): p is Project => p !== null);
      }

      if (projects.length === 0) {
        const defaultProject = createDefaultProject('Untitled Project');
        projects = [defaultProject];
        storage.saveProject(defaultProject);
      }

      const lastSelectedId = storage.getLastSelectedProjectId();
      const currentProjectId =
        lastSelectedId && projects.some((p) => p.id === lastSelectedId)
          ? lastSelectedId
          : projects[0].id;

      return {
        projects,
        currentProjectId,
      };
    }

    case 'CREATE_PROJECT': {
      if (state.projects.some((project) => project.name === action.name)) {
        return state;
      }

      const newProject = createDefaultProject(action.name);

      const newState = {
        currentProjectId: newProject.id,
        projects: [...state.projects, newProject],
      };

      storage.saveProject(newProject);
      storage.setLastSelectedProjectId(newProject.id);

      return newState;
    }

    case 'UPDATE_PROJECT': {
      const updatedProjects = state.projects.map((p) =>
        p.id === action.project.id ? action.project : p
      );

      const newState = {
        ...state,
        projects: updatedProjects,
      };

      storage.saveProject(action.project);

      return newState;
    }

    case 'DELETE_PROJECT': {
      const updatedProjects = state.projects.filter((p) => p.id !== action.id);

      const newState = {
        projects: updatedProjects,
        currentProjectId:
          state.currentProjectId === action.id
            ? (updatedProjects[0]?.id ?? null)
            : state.currentProjectId,
      };

      storage.deleteProject(action.id);

      return newState;
    }

    case 'SELECT_PROJECT': {
      const newState = {
        ...state,
        currentProjectId: action.id,
      };

      storage.setLastSelectedProjectId(action.id);

      return newState;
    }

    case 'IMPORT_PROJECT': {
      const newState = {
        ...state,
        projects: [...state.projects, action.project],
        currentProjectId: action.project.id,
      };

      storage.saveProject(action.project);

      return newState;
    }

    default:
      return state;
  }
};
