import { createDefaultProject } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';
import { projectsReducer } from '@/reducers/projectsReducer';
import {
  createProjectDB,
  deleteProjectDB,
  getProjectsDB,
  updateProjectDB,
} from '@/services/projectsDb';
import { Project } from '@/types';
import { useCallback, useEffect, useReducer } from 'react';

export function useProjects() {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(projectsReducer, {
    currentProjectId: '',
    projects: [],
  });

  useEffect(() => {
    if (!user) {
      dispatch({ type: 'LOAD_PROJECTS', projects: [] });
    }
  }, [user]);

  const loadProjects = useCallback(async () => {
    if (!user) return;

    try {
      const projects = await getProjectsDB();
      dispatch({ type: 'LOAD_PROJECTS', projects });
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }, [user]);

  const createProject = useCallback(
    async (name: string) => {
      if (!user) return false;

      try {
        const project = createDefaultProject(name, user.id);
        const createdProject = await createProjectDB(project);
        dispatch({ type: 'CREATE_PROJECT', project: createdProject });
        return true;
      } catch (error) {
        console.error('Error creating project:', error);
        return false;
      }
    },
    [user]
  );

  const deleteProject = useCallback(
    async (id: string) => {
      if (!user) return;

      try {
        await deleteProjectDB(id);
        dispatch({ type: 'DELETE_PROJECT', id });
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    },
    [user]
  );

  const updateProject = useCallback(
    async (project: Project) => {
      if (!user) return;

      try {
        await updateProjectDB(project.id, project);
        dispatch({ type: 'UPDATE_PROJECT', project });
      } catch (error) {
        console.error('Error updating project:', error);
      }
    },
    [user]
  );

  return {
    ...state,
    createProject,
    deleteProject,
    loadProjects,
    updateProject,
    setCurrentProjectId: (id: string) =>
      dispatch({ type: 'SELECT_PROJECT', id }),
    importProject: (project: Project) =>
      dispatch({ type: 'IMPORT_PROJECT', project }),
  };
}
