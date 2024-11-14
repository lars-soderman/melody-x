'use client';

import { useProjectsReducer } from '@/hooks/useProjectsReducer';
import { ImportButton } from '@components/ImportButton';
import { Toast } from '@components/Toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProjectsPage() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(
    null
  );
  const [isCreatingInProgress, setIsCreatingInProgress] = useState(false);

  const { projects, createProject, deleteProject, importProject } =
    useProjectsReducer();

  const handleCreateProject = async () => {
    const trimmedName = newProjectName.trim();
    if (trimmedName && !isCreatingInProgress) {
      try {
        setIsCreatingInProgress(true);
        const success = await createProject(trimmedName);
        if (success) {
          setIsCreating(false);
          setNewProjectName('');
          showToastMessage('Project created successfully!');
        } else {
          showToastMessage('Failed to create project. Please try again.');
        }
      } finally {
        setIsCreatingInProgress(false);
      }
    }
  };

  const handleDelete = async (projectId: string) => {
    if (confirmingDeleteId === projectId) {
      try {
        await deleteProject(projectId);
        setConfirmingDeleteId(null);
        showToastMessage('Project deleted successfully!');
      } catch (error) {
        showToastMessage('Failed to delete project. Please try again.');
      }
    } else {
      setConfirmingDeleteId(projectId);
    }
  };

  const handleOpen = (projectId: string) => {
    router.push(`/editor/${projectId}`);
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Projects</h1>
        <div className="flex gap-2">
          <ImportButton onImport={importProject} />
          <button
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={() => setIsCreating(true)}
          >
            New Project
          </button>
        </div>
      </div>

      {isCreating && (
        <form
          className="mb-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateProject();
          }}
        >
          <input
            autoFocus
            className="mr-2 rounded border border-gray-200 p-2"
            placeholder="Project name"
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            disabled={isCreatingInProgress}
            type="submit"
          >
            {isCreatingInProgress ? 'Creating...' : 'Create'}
          </button>
        </form>
      )}

      <ul className="space-y-4">
        {projects.map((project) => (
          <li
            key={project.id}
            className="flex items-center justify-between rounded-lg border p-4 shadow-sm"
          >
            <div>
              <h2 className="text-lg font-semibold">{project.name}</h2>
              <p className="text-sm text-gray-500">
                Last updated: {new Date(project.updatedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={() => handleOpen(project.id)}
              >
                Open
              </button>
              <button
                className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                onClick={() => handleDelete(project.id)}
              >
                {confirmingDeleteId === project.id ? 'Confirm' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}
