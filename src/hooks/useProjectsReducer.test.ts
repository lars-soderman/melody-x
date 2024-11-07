import { storage } from '@/app/lib/storage';
import { createDefaultProject } from '@/constants';
import { projectsReducer } from '@/reducers/projectsReducer';

// Mock the storage module
jest.mock('@/app/lib/storage', () => ({
  storage: {
    deleteProject: jest.fn(),
    getLastSelectedProjectId: jest.fn(),
    getProject: jest.fn(),
    getProjectIds: jest.fn(),
    saveProject: jest.fn().mockReturnValue(true),
    setLastSelectedProjectId: jest.fn(),
  },
}));
const mockedStorage = storage as jest.Mocked<typeof storage>;

describe('projectsReducer', () => {
  const initialState = {
    currentProjectId: '',
    projects: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load projects from storage', () => {
    const mockProject = createDefaultProject('Test Project');
    mockedStorage.getProjectIds.mockReturnValue([mockProject.id]);
    mockedStorage.getProject.mockReturnValue(mockProject);
    mockedStorage.getLastSelectedProjectId.mockReturnValue(null);

    const newState = projectsReducer(initialState, { type: 'LOAD_PROJECTS' });

    expect(newState.projects).toHaveLength(1);
    expect(newState.projects[0]).toEqual(mockProject);
    expect(newState.currentProjectId).toBe(mockProject.id);
  });

  it('should create default project if no projects exist', () => {
    mockedStorage.getProjectIds.mockReturnValue([]);
    mockedStorage.getLastSelectedProjectId.mockReturnValue(null);

    const newState = projectsReducer(initialState, { type: 'LOAD_PROJECTS' });

    expect(newState.projects).toHaveLength(1);
    expect(newState.projects[0].name).toBe('Untitled Project');
    expect(mockedStorage.saveProject).toHaveBeenCalled();
  });

  it('should prevent creating project with duplicate name', () => {
    const existingProject = createDefaultProject('Test Project');
    const state = {
      currentProjectId: existingProject.id,
      projects: [existingProject],
    };

    // Mock Date.now() to ensure consistent ID generation
    jest.spyOn(Date, 'now').mockReturnValue(1710936000000);

    const newState = projectsReducer(state, {
      type: 'CREATE_PROJECT',
      name: 'Test Project',
    });

    expect(newState).toEqual(state);
    expect(mockedStorage.saveProject).not.toHaveBeenCalled();
  });

  it('should create new project with unique id', () => {
    // Mock Date.now() to ensure consistent ID generation
    jest.spyOn(Date, 'now').mockReturnValue(1710936000000);

    // Mock successful storage save
    mockedStorage.saveProject.mockReturnValue(true);

    const newState = projectsReducer(initialState, {
      type: 'CREATE_PROJECT',
      name: 'Test Project',
    });

    expect(newState.projects).toHaveLength(1);
    expect(newState.projects[0].name).toBe('Test Project');
    expect(newState.projects[0].id).toBe('new-1710936000000');
    expect(mockedStorage.saveProject).toHaveBeenCalled();
  });

  it('should update existing project', () => {
    const existingProject = createDefaultProject('Test Project');
    const updatedProject = { ...existingProject, name: 'Updated Name' };

    const state = {
      currentProjectId: existingProject.id,
      projects: [existingProject],
    };

    const newState = projectsReducer(state, {
      type: 'UPDATE_PROJECT',
      project: updatedProject,
    });

    expect(newState.projects[0].name).toBe('Updated Name');
    expect(mockedStorage.saveProject).toHaveBeenCalledWith(updatedProject);
  });

  it('should select project and update storage', () => {
    const project = createDefaultProject('Test Project');
    const state = {
      currentProjectId: '',
      projects: [project],
    };

    const newState = projectsReducer(state, {
      type: 'SELECT_PROJECT',
      id: project.id,
    });

    expect(newState.currentProjectId).toBe(project.id);
    expect(mockedStorage.setLastSelectedProjectId).toHaveBeenCalledWith(
      project.id
    );
  });

  it('should import project and select it', () => {
    const importedProject = createDefaultProject('Imported Project');

    const newState = projectsReducer(initialState, {
      type: 'IMPORT_PROJECT',
      project: importedProject,
    });

    expect(newState.projects).toHaveLength(1);
    expect(newState.projects[0]).toEqual(importedProject);
    expect(newState.currentProjectId).toBe(importedProject.id);
    expect(mockedStorage.saveProject).toHaveBeenCalledWith(importedProject);
  });
});
