'use client';

import { deleteProject, updateProject } from '@/app/actions';
import { AppProject } from '@/types';
import { useRouter } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import { useDebouncedCallback } from 'use-debounce';

type Props = {
  project: AppProject;
};

export function ProjectCard({ project: initialProject }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [project, setProject] = useState(initialProject);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounced server update
  const debouncedUpdateProject = useDebouncedCallback(
    async (updatedProject: AppProject) => {
      try {
        await updateProject(updatedProject.id, updatedProject);
        startTransition(() => {
          router.refresh();
        });
      } catch (error) {
        // Revert on error
        setProject(initialProject);
        console.error('Error updating project:', error);
      }
    },
    500
  );

  const handleRename = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!name.trim() || name === project.name) {
        setIsEditing(false);
        return;
      }

      // Optimistic update
      setProject((prev) => ({ ...prev, name: name.trim() }));
      setIsEditing(false);

      // Debounced server update
      debouncedUpdateProject({
        ...project,
        name: name.trim(),
      });
    },
    [name, project, debouncedUpdateProject]
  );

  const handleDelete = useCallback(async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setIsDeleting(true);
    // Optimistic UI update
    setProject((prev) => ({ ...prev, isDeleting: true }));

    try {
      await deleteProject(project.id);
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      setIsDeleting(false);
    }
  }, [project, router]);

  return (
    <div
      className={`group relative rounded-lg border bg-white p-4 shadow-sm transition-all ${isPending ? 'opacity-50' : ''} ${isDeleting ? 'scale-95 opacity-50' : ''}`}
    >
      <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          className="rounded bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          disabled={isEditing}
          title="Rename"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </button>
        <button
          className="rounded bg-red-100 p-2 text-red-600 hover:bg-red-200 disabled:opacity-50"
          disabled={isDeleting}
          title="Delete"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </button>
      </div>

      {/* Project name (editable or static) */}
      {isEditing ? (
        <form
          className="mb-2"
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleRename}
        >
          <input
            autoFocus
            className="w-full rounded border px-2 py-1"
            value={name}
            onBlur={handleRename}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsEditing(false);
                setName(project.name);
              }
            }}
          />
        </form>
      ) : (
        <h3 className="mb-2 font-semibold">{project.name}</h3>
      )}

      {/* Project metadata */}
      <div
        className="cursor-pointer"
        onClick={() => router.push(`/editor/${project.id}`)}
      >
        <div className="mb-4 text-sm text-gray-600">
          Created {new Date(project.createdAt).toLocaleDateString()}
        </div>

        {project.collaborators && project.collaborators.length > 0 && (
          <div className="text-sm text-gray-500">
            <div className="mb-1">Shared with:</div>
            <div className="flex flex-wrap gap-1">
              {project.collaborators.map((collab) => (
                <span
                  key={collab.user_id}
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs"
                >
                  {collab.user?.email}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
