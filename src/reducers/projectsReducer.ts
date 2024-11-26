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
        ownedProjects: action.ownedProjects,
        sharedProjects: action.sharedProjects,
      };

    case 'CREATE_PROJECT': {
      return {
        ...state,
        currentProjectId: action.project.id,
        ownedProjects: [...state.ownedProjects, action.project],
      };
    }

    case 'UPDATE_PROJECT': {
      const updatedOwnedProjects = state.ownedProjects.map((p) =>
        p.id === action.project.id ? action.project : p
      );
      const updatedSharedProjects = state.sharedProjects.map((p) =>
        p.id === action.project.id ? action.project : p
      );

      return {
        ...state,
        ownedProjects: updatedOwnedProjects,
        sharedProjects: updatedSharedProjects,
      };
    }

    case 'DELETE_PROJECT': {
      const updatedOwnedProjects = state.ownedProjects.filter(
        (p) => p.id !== action.id
      );
      const updatedSharedProjects = state.sharedProjects.filter(
        (p) => p.id !== action.id
      );

      const newState = {
        ...state,
        ownedProjects: updatedOwnedProjects,
        sharedProjects: updatedSharedProjects,
        currentProjectId:
          state.currentProjectId === action.id
            ? (updatedOwnedProjects[0]?.id ??
              updatedSharedProjects[0]?.id ??
              null)
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
        ownedProjects: [...state.ownedProjects, action.project],
        sharedProjects: [...state.sharedProjects, action.project],
        currentProjectId: action.project.id,
      };

      storage.saveProject(action.project);

      return newState;
    }

    default:
      return state;
  }
};
