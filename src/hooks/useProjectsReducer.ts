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

type LastCreation = {
  name: string;
  timestamp: number;
};

type ProjectsReducerWithMeta = {
  (state: ProjectsState, action: ProjectsAction): ProjectsState;
  lastCreation?: LastCreation;
};

const projectsReducer: ProjectsReducerWithMeta = (state, action) => {
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
      if (
        (projectsReducer as ProjectsReducerWithMeta).lastCreation?.name ===
          action.name &&
        Date.now() -
          (projectsReducer as ProjectsReducerWithMeta).lastCreation!.timestamp <
          1000
      ) {
        return state;
      }

      const newProject = createDefaultProject(action.name);
      storage.saveProject(newProject);
      storage.setLastSelectedProjectId(newProject.id);

      projectsReducer.lastCreation = {
        name: action.name,
        timestamp: Date.now(),
      };

      return {
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
      storage.setLastSelectedProjectId(action.id);
      return {
        ...state,
        currentProjectId: action.id,
      };
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

  const createProject = useCallback(
    (name: string) => {
      if (
        (projectsReducer as ProjectsReducerWithMeta).lastCreation?.name ===
          name &&
        Date.now() -
          (projectsReducer as ProjectsReducerWithMeta).lastCreation!.timestamp <
          1000
      ) {
        return;
      }

      dispatch({ type: 'CREATE_PROJECT', name });
      loadProjects();
    },
    [loadProjects]
  );

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
  };
}
