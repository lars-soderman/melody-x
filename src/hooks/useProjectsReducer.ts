import { createDefaultProject } from '@/constants';
import { projectsReducer } from '@/reducers/projectsReducer';
import {
  createProjectDB,
  deleteProjectDB,
  getProjectsDB,
  updateProjectDB,
} from '@/services/projects';
import { Project } from '@/types';
import { decompressProject } from '@/utils/compression';
import { useCallback, useEffect, useReducer } from 'react';

export function useProjectsReducer() {
  const [state, dispatch] = useReducer(projectsReducer, {
    currentProjectId: '',
    projects: [],
  });

  const loadProjects = useCallback(async () => {
    try {
      const projects = await getProjectsDB();
      dispatch({ type: 'LOAD_PROJECTS', projects }); // Updated action type
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const createProject = useCallback(async (name: string): Promise<boolean> => {
    try {
      // Create a new project with default values
      const newProjectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
        ...createDefaultProject(name),
        name,
      };

      // Create in DB
      const newProject = await createProjectDB(newProjectData);

      // Then update local state
      dispatch({ type: 'CREATE_PROJECT', project: newProject });

      return true;
    } catch (error) {
      console.error('Error creating project:', error);
      return false;
    }
  }, []);

  const importProject = useCallback(async (importedProject: Project) => {
    try {
      const decompressedProject = decompressProject(importedProject);
      const savedProject = await createProjectDB(decompressedProject);

      dispatch({ type: 'IMPORT_PROJECT', project: savedProject });
    } catch (error) {
      console.error('Error importing project:', error);
    }
  }, []);

  return {
    createProject,
    currentProject: state.projects.find((p) => p.id === state.currentProjectId),
    deleteProject: useCallback(async (id: string) => {
      try {
        await deleteProjectDB(id);
        dispatch({ type: 'DELETE_PROJECT', id });
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }, []),
    importProject,
    loadProjects,
    projects: state.projects,
    setCurrentProjectId: useCallback((id: string) => {
      dispatch({ type: 'SELECT_PROJECT', id });
    }, []),
    updateProject: useCallback(async (project: Project) => {
      try {
        await updateProjectDB(project.id, project);
        dispatch({ type: 'UPDATE_PROJECT', project });
      } catch (error) {
        console.error('Error updating project:', error);
      }
    }, []),
  };
}
