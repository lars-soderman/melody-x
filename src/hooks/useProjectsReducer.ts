import { createDefaultProject } from '@/constants';
import { Project } from '@/types';
import { storage } from '@/utils/storage';
import { useCallback, useReducer } from 'react';

type ProjectsState = {
  currentProjectId: string;
  projects: Project[];
};

type ProjectsAction =
  | { type: 'LOAD_PROJECTS' }
  | { name: string; type: 'CREATE_PROJECT' }
  | { project: Project; type: 'UPDATE_PROJECT' }
  | { id: string; type: 'DELETE_PROJECT' }
  | { id: string; type: 'SELECT_PROJECT' };

function projectsReducer(
  state: ProjectsState,
  action: ProjectsAction
): ProjectsState {
  switch (action.type) {
    case 'LOAD_PROJECTS': {
      const projectIds = storage.getProjectIds();
      let projects = projectIds
        .map((id) => storage.getProject(id))
        .filter((p): p is Project => p !== null);

      // Create default project if none exist
      if (projects.length === 0) {
        const defaultProject = createDefaultProject('Untitled Project');
        storage.saveProject(defaultProject);
        projects = [defaultProject];
      }

      return {
        ...state,
        projects,
        currentProjectId: projects[0].id, // Now safe to access since projects array will never be empty
      };
    }

    case 'CREATE_PROJECT': {
      const newProject = createDefaultProject(action.name);
      storage.saveProject(newProject);

      return {
        ...state,
        projects: [...state.projects, newProject],
        currentProjectId: newProject.id,
      };
    }

    case 'UPDATE_PROJECT': {
      const updatedProjects = state.projects.map((p) =>
        p.id === action.project.id ? action.project : p
      );

      storage.saveProject(action.project);

      return {
        ...state,
        projects: updatedProjects,
      };
    }

    case 'DELETE_PROJECT': {
      const updatedProjects = state.projects.filter((p) => p.id !== action.id);
      storage.deleteProject(action.id);

      return {
        ...state,
        projects: updatedProjects,
        currentProjectId:
          state.currentProjectId === action.id
            ? (updatedProjects[0]?.id ?? null)
            : state.currentProjectId,
      };
    }

    case 'SELECT_PROJECT': {
      return {
        ...state,
        currentProjectId: action.id,
      };
    }

    default:
      return state;
  }
}

export function useProjectsReducer() {
  const [state, dispatch] = useReducer(projectsReducer, {
    projects: [],
    currentProjectId: '',
  });

  const loadProjects = useCallback(() => {
    dispatch({ type: 'LOAD_PROJECTS' });
  }, []);

  const createProject = useCallback((name: string) => {
    dispatch({ type: 'CREATE_PROJECT', name });
  }, []);

  const updateProject = useCallback((project: Project) => {
    dispatch({ type: 'UPDATE_PROJECT', project });
  }, []);

  const deleteProject = useCallback((id: string) => {
    dispatch({ type: 'DELETE_PROJECT', id });
  }, []);

  const selectProject = useCallback((id: string) => {
    dispatch({ type: 'SELECT_PROJECT', id });
  }, []);

  const currentProject =
    state.projects.find((p) => p.id === state.currentProjectId) ??
    state.projects[0];

  const setCurrentProjectId = useCallback((id: string) => {
    dispatch({ type: 'SELECT_PROJECT', id });
  }, []);

  return {
    currentProject,
    loadProjects,
    projects: state.projects,
    setCurrentProjectId,
    updateProject,
    createProject,
    deleteProject,
    selectProject,
  };
}
