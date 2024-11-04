import { storage } from '@/app/lib/storage';
import { createDefaultProject } from '@/constants';
import { Project } from '@/types';
import { decompressProject } from '@/utils/compression';
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
  | { id: string; type: 'SELECT_PROJECT' }
  | { project: Project; type: 'IMPORT_PROJECT' };

const projectsReducer = (
  state: ProjectsState,
  action: ProjectsAction
): ProjectsState => {
  switch (action.type) {
    case 'LOAD_PROJECTS': {
      const projectIds = storage.getProjectIds();
      let projects = projectIds
        .map((id) => storage.getProject(id))
        .filter((p): p is Project => p !== null);

      if (projects.length === 0 && projectIds.length === 0) {
        const defaultProject = createDefaultProject('Untitled Project');
        storage.saveProject(defaultProject);
        projects = [defaultProject];
      }

      const lastSelectedId = storage.getLastSelectedProjectId();
      return {
        projects,
        currentProjectId: lastSelectedId || projects[0]?.id || '',
      };
    }

    case 'CREATE_PROJECT': {
      // Check for existing project with same name in storage
      const projectIds = storage.getProjectIds();
      const existingProjects = projectIds
        .map((id) => storage.getProject(id))
        .filter((p): p is Project => p !== null);

      const existingProject = existingProjects.find(
        (p) => p.name === action.name
      );
      if (existingProject) {
        return state; // Don't create if name exists in storage
      }

      // Create new project with unique ID
      let lastCreatedId = 0;
      const newProject = {
        ...createDefaultProject(action.name),
        id: `${Date.now()}-${++lastCreatedId}`,
      };

      storage.saveProject(newProject);

      // Update state with all projects from storage
      const updatedProjects = storage
        .getProjectIds()
        .map((id) => storage.getProject(id))
        .filter((p): p is Project => p !== null);

      return {
        projects: updatedProjects,
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
      storage.setLastSelectedProjectId(action.id);
      return {
        ...state,
        currentProjectId: action.id,
      };
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

export function useProjectsReducer() {
  const [state, dispatch] = useReducer(projectsReducer, {
    currentProjectId: '',
    projects: [],
  });

  const loadProjects = useCallback(async (): Promise<void> => {
    dispatch({ type: 'LOAD_PROJECTS' });
  }, []);

  const createProject = useCallback((name: string) => {
    dispatch({ type: 'CREATE_PROJECT', name });
    // Force refresh after creation
    dispatch({ type: 'LOAD_PROJECTS' });
  }, []);

  const importProject = useCallback((importedProject: Project) => {
    const decompressedProject = decompressProject(importedProject);

    dispatch({ type: 'IMPORT_PROJECT', project: decompressedProject });
  }, []);

  return {
    createProject,
    currentProject: state.projects.find((p) => p.id === state.currentProjectId),
    deleteProject: useCallback(
      (id: string) => {
        dispatch({ type: 'DELETE_PROJECT', id });
        loadProjects(); // Also reload after delete
      },
      [loadProjects]
    ),
    loadProjects,
    projects: state.projects,
    setCurrentProjectId: useCallback((id: string) => {
      dispatch({ type: 'SELECT_PROJECT', id });
    }, []),
    updateProject: useCallback((project: Project) => {
      dispatch({ type: 'UPDATE_PROJECT', project });
    }, []),
    importProject,
  };
}
