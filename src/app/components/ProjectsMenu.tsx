import { Project } from '@/types';
import { useState } from 'react';
import { Popover } from './Popover';

type ProjectsMenuProps = {
  createProject: (name: string) => void;
  currentProject: Project;
  onSelectProject: (projectId: string) => void;
  projects: Project[];
  updateProject: (project: Project) => void;
};

export function ProjectsMenu({
  createProject,
  currentProject,
  onSelectProject,
  projects,
  updateProject,
}: ProjectsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject(newProjectName.trim());
      setNewProjectName('');
      setIsCreating(false);
    }
  };

  const handleUpdateName = (project: Project) => {
    if (editingName.trim() && editingName !== project.name) {
      updateProject({
        ...project,
        name: editingName.trim(),
        modifiedAt: new Date().toISOString(),
      });
    }
    setEditingProjectId(null);
  };

  return (
    <div className="absolute left-4 top-4">
      <Popover
        align="start"
        isOpen={isOpen}
        trigger={
          <button
            aria-label="Projects"
            className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        }
        onClose={() => {
          setIsOpen(false);
          setIsCreating(false);
          setNewProjectName('');
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-700">Projects</h2>
            <button
              aria-label="New project"
              className="rounded p-1 text-gray-400 hover:bg-gray-100"
              onClick={() => setIsCreating(true)}
            >
              +
            </button>
          </div>

          {isCreating && (
            <div className="flex flex-col gap-2">
              <input
                autoFocus
                className="rounded border border-gray-200 p-2 text-sm"
                placeholder="Project name"
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setIsCreating(false);
                    setNewProjectName('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
                  onClick={handleCreateProject}
                >
                  Create
                </button>
              </div>
            </div>
          )}

          <div className="flex max-h-[300px] flex-col gap-2 overflow-y-auto">
            {projects.map((project) => (
              <button
                key={project.id}
                className={`group flex items-center justify-between rounded p-2 text-left text-sm hover:bg-gray-100 ${project.id === currentProject?.id ? 'bg-gray-50' : ''}`}
                onClick={() => {
                  if (!editingProjectId) {
                    onSelectProject(project.id);
                    setIsOpen(false);
                  }
                }}
              >
                <div className="flex-1">
                  {editingProjectId === project.id ? (
                    <input
                      autoFocus
                      className="w-full rounded border border-gray-200 p-1 text-sm"
                      value={editingName}
                      onBlur={() => handleUpdateName(project)}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateName(project);
                        } else if (e.key === 'Escape') {
                          setEditingProjectId(null);
                        }
                      }}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{project.name}</span>
                      <button
                        className="opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProjectId(project.id);
                          setEditingName(project.name);
                        }}
                      >
                        <svg
                          className="h-3.5 w-3.5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Modified {new Date(project.modifiedAt).toLocaleDateString()}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Popover>
    </div>
  );
}
