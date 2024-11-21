import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from '@/app/actions';
import { createDefaultProject } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';
import { mapProjectFromDB } from '@/lib/mappers';
import { projectsReducer } from '@/reducers/projectsReducer';
import { ProjectsAction, ProjectsState } from '@/reducers/types/projectActions';
import type { AppProject } from '@/types';
import type { CreateProjectInput } from '@/types/project';
import { useCallback, useEffect, useReducer } from 'react';

export function useProjects() {
  const { user } = useAuth();
  const [state, dispatch] = useReducer<
    React.Reducer<ProjectsState, ProjectsAction>
  >(projectsReducer, {
    currentProjectId: null,
    ownedProjects: [],
    projects: [],
    sharedProjects: [],
    isLoading: true,
  });

  const loadProjects = useCallback(async () => {
    console.log('Loading projects for user:', user);
    if (!user) {
      console.log('No user, clearing projects');
      dispatch({
        type: 'LOAD_PROJECTS',
        ownedProjects: [],
        sharedProjects: [],
      });
      return;
    }

    try {
      const projects = await getProjects(user.id);
      console.log('Fetched projects:', projects);

      const ownedProjects = projects.filter((p) => p.owner_id === user.id);
      const sharedProjects = projects.filter((p) => p.owner_id !== user.id);

      console.log('Owned projects:', ownedProjects);
      console.log('Shared projects:', sharedProjects);

      dispatch({
        type: 'LOAD_PROJECTS',
        ownedProjects,
        sharedProjects,
      });
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }, [user]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const create = useCallback(
    async (name: string) => {
      if (!user) return false;

      try {
        const defaultProject = createDefaultProject(name, user.id);

        const createInput: CreateProjectInput = {
          name: defaultProject.name,
          ownerId: user.id,
          gridData: {
            boxes: defaultProject.boxes,
            cols: defaultProject.cols,
            rows: defaultProject.rows,
            font: defaultProject.font,
          },
          hints: defaultProject.hints,
          isPublic: defaultProject.isPublic,
        };

        const prismaProject = await createProject(createInput);
        const appProject = mapProjectFromDB(prismaProject);

        dispatch({ type: 'CREATE_PROJECT', project: appProject });
        return true;
      } catch (error) {
        console.error('Error creating project:', error);
        return false;
      }
    },
    [user]
  );

  const remove = useCallback(
    async (id: string) => {
      if (!user) return;

      try {
        await deleteProject(id);
        dispatch({ type: 'DELETE_PROJECT', id });
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    },
    [user]
  );

  const update = useCallback(
    async (project: AppProject) => {
      if (!user) return;

      try {
        const prismaProject = await updateProject(project.id, project);
        const appProject = mapProjectFromDB(prismaProject);
        dispatch({ type: 'UPDATE_PROJECT', project: appProject });
      } catch (error) {
        console.error('Error updating project:', error);
      }
    },
    [user]
  );

  return {
    ...state,
    create,
    update,
    remove,
  };
}
