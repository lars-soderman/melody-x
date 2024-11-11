import { Toast } from '@/components/Toast';
import { Project } from '@/types';
import { compressProject, decompressProject } from '@/utils/compression';
import { decodeProject, encodeProject } from '@/utils/urlEncoding';
import { useEffect, useState } from 'react';
import { AuthButton } from './AuthButton';
import { ImportButton } from './ImportButton';
import { Popover } from './Popover';

type ProjectsMenuProps = {
  createProject: (name: string) => void;
  currentProject: Project;
  deleteProject: (id: string) => void;
  importProject: (project: Project) => void;
  onSelectProject: (projectId: string) => void;
  projects: Project[];
  updateProject: (project: Project) => void;
};

export function ProjectsMenu({
  createProject,
  currentProject,
  deleteProject,
  importProject,
  onSelectProject,
  projects,
  updateProject,
}: ProjectsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(
    null
  );
  const [isCreatingInProgress, setIsCreatingInProgress] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const encodedProject = url.searchParams.get('project');

    if (encodedProject) {
      try {
        const decodedProject = decodeProject(encodedProject);
        if (decodedProject) {
          const decompressedProject = decompressProject(decodedProject);
          importProject(decompressedProject);

          // Clear the URL parameter after importing
          url.searchParams.delete('project');
          window.history.replaceState({}, '', url.toString());
        }
      } catch (error) {
        console.error('Failed to import project from URL:', error);
      }
    }
  }, [importProject]); // Run once on mount

  const handleCreateProject = async () => {
    const trimmedName = newProjectName.trim();
    if (trimmedName && !isCreatingInProgress) {
      setIsCreatingInProgress(true);
      await createProject(trimmedName);
      setIsCreating(false);
      setNewProjectName('');
      setIsCreatingInProgress(false);
      setIsOpen(false);
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

  const handleShareProject = (project: Project) => {
    const compressedProject = compressProject(project);
    const encodedProject = encodeProject(compressedProject);

    // Create share URL
    const url = new URL(window.location.href);
    url.searchParams.set('project', encodedProject ?? '');
    navigator.clipboard.writeText(url.toString());
    setShowToast(true);
  };

  return (
    <div className="relative">
      <div className="absolute left-4 top-4 z-40">
        <Popover
          align="start"
          isOpen={isOpen}
          trigger={
            <button
              aria-label="Projects"
              className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
              data-testid="projects-menu-button"
              title="Projects"
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
            setConfirmingDeleteId(null);
          }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-700">Projects</h2>
              <div className="flex gap-1">
                {/* Copy link to project */}
                <button
                  className="flex w-8 rounded p-1 text-gray-400 hover:bg-gray-100"
                  title="Copy link to project"
                  onClick={() => handleShareProject(currentProject)}
                >
                  {showToast ? (
                    <span>✓</span>
                  ) : (
                    <svg
                      className="m-auto h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
                {showToast && (
                  <Toast
                    message="Link copied to clipboard!"
                    onClose={() => setShowToast(false)}
                  />
                )}
                {/* import project */}
                <ImportButton
                  onImport={(project) => {
                    importProject(project);
                  }}
                />
                {/* new project */}
                <button
                  aria-label="Create new project"
                  className="flex h-8 w-8 items-center justify-center rounded text-2xl text-gray-400 hover:bg-gray-100"
                  data-testid="new-project-button"
                  title="Create new project"
                  onClick={() => setIsCreating(true)}
                >
                  +
                </button>
              </div>
            </div>

            {isCreating && (
              <form
                className="flex flex-col gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateProject();
                }}
              >
                <input
                  autoFocus
                  className="rounded border border-gray-200 p-2 text-sm"
                  placeholder="Project name"
                  type="text"
                  value={newProjectName}
                  onChange={(e) => {
                    setNewProjectName(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                    }
                  }}
                />
                <div className="flex justify-end gap-2">
                  <button
                    className="text-sm text-gray-500 hover:text-gray-700"
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setNewProjectName('');
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
                    disabled={isCreatingInProgress}
                    type="submit"
                  >
                    Create
                  </button>
                </div>
              </form>
            )}

            {projects.map((project) => (
              <div
                key={project.id}
                className={`group flex items-center justify-between rounded text-left text-sm hover:bg-gray-100 ${
                  project.id === currentProject?.id ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex-1">
                  {editingProjectId === project.id ? (
                    <input
                      autoFocus
                      className="w-full rounded border border-gray-200 p-1 text-sm"
                      value={editingName}
                      onBlur={() => handleUpdateName(project)}
                      onChange={(e) => setEditingName(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateName(project);
                        } else if (e.key === 'Escape') {
                          setEditingProjectId(null);
                        }
                      }}
                    />
                  ) : (
                    <button
                      className="p-2"
                      onClick={() => {
                        if (!editingProjectId && !confirmingDeleteId) {
                          onSelectProject(project.id);
                          setIsOpen(false);
                        }
                      }}
                    >
                      {project.name}
                    </button>
                  )}
                </div>

                <div className="invisible flex gap-1 group-hover:visible">
                  <button
                    className="rounded p-0.5 hover:bg-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingProjectId(project.id);
                      setEditingName(project.name);
                    }}
                  >
                    <svg
                      className="h-4 w-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    className="rounded p-0.5 hover:bg-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirmingDeleteId === project.id) {
                        deleteProject(project.id);
                        setConfirmingDeleteId(null);
                      } else {
                        setConfirmingDeleteId(project.id);
                      }
                    }}
                  >
                    {confirmingDeleteId === project.id ? (
                      <span className="px-1 text-red-500">×</span>
                    ) : (
                      <svg
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-4">
            {/* logout button */}
            <AuthButton />
          </div>
        </Popover>
      </div>
    </div>
  );
}
