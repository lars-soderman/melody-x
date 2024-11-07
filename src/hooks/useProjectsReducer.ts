import { projectsReducer } from '@/reducers/projectsReducer';
import { Project } from '@/types';
import { decompressProject } from '@/utils/compression';
import { useCallback, useReducer } from 'react';

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
      const isDuplicate = state.projects.some(
        (project) => project.name === name
      );
      if (isDuplicate) {
        return false;
      }
      dispatch({ type: 'CREATE_PROJECT', name });
      // Force refresh after creation
      dispatch({ type: 'LOAD_PROJECTS' });
      return true;
    },
    [state.projects]
  );

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
