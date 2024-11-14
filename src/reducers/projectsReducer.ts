import { storage } from '@/utils/storage';
import { ProjectsAction, ProjectsState } from './types/projectActions';

export const projectsReducer = (
  state: ProjectsState,
  action: ProjectsAction
): ProjectsState => {
  switch (action.type) {
    case 'LOAD_PROJECTS':
      return {
        ...state,
        projects: action.projects,
      };

    case 'CREATE_PROJECT': {
      return {
        currentProjectId: action.project.id,
        projects: [...state.projects, action.project],
      };
    }

    case 'UPDATE_PROJECT': {
      const updatedProjects = state.projects.map((p) =>
        p.id === action.project.id ? action.project : p
      );

      return {
        ...state,
        projects: updatedProjects,
      };
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
