import { storage } from '@/app/lib/storage';
import { createDefaultProject } from '@/constants';
import { Project } from '@/types';
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

      // Only create default project if no projects exist AND no project IDs exist
      if (projects.length === 0 && projectIds.length === 0) {
        const defaultProject = createDefaultProject('Untitled Project');
        storage.saveProject(defaultProject);
        projects = [defaultProject];
      }

      return {
        ...state,
        projects,
        currentProjectId: projects[0]?.id || '',
      };
    }

    case 'CREATE_PROJECT': {
      console.log('CREATE_PROJECT action:', action.name);
      const newProject = createDefaultProject(action.name);
      console.log('Created new project:', {
        id: newProject.id,
        name: newProject.name,
      });
      storage.saveProject(newProject);

      return {
        ...state,
        currentProjectId: newProject.id,
        projects: [...state.projects, newProject],
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
    currentProjectId: '',
    projects: [],
  });

  const loadProjects = useCallback(() => {
    return new Promise<void>((resolve) => {
      dispatch({ type: 'LOAD_PROJECTS' });
      // Use setTimeout to ensure state update happens before resolving
      setTimeout(resolve, 0);
    });
  }, []);

  const createProject = useCallback((name: string) => {
    console.log('createProject callback called');
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
