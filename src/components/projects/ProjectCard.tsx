'use client';

import { deleteProject, updateProject } from '@/app/actions';
import { AppProject } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { GridPreview } from '../grid/GridPreview';

type Props = {
  project: AppProject;
};

export function ProjectCard({ project }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(project.name);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setIsDeleting(true);
    try {
      await deleteProject(project.id);
      router.refresh();
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const debouncedUpdate = useDebouncedCallback(async (newName: string) => {
    try {
      await updateProject(project.id, { name: newName });
      router.refresh();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  }, 1000);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    debouncedUpdate(newName);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking input or buttons
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLButtonElement
    ) {
      return;
    }
    router.push(`/editor/${project.id}`);
  };

  return (
    <div className="relative h-32 overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex h-full cursor-pointer p-4" onClick={handleCardClick}>
        <div className="flex flex-1 flex-col justify-between">
          <div className="group flex items-center">
            {isEditing ? (
              <input
                autoFocus
                className="w-full rounded border px-2 py-1 text-lg"
                value={name}
                onBlur={() => setIsEditing(false)}
                onChange={handleNameChange}
              />
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium text-gray-900">{name}</h3>
                <button
                  className="invisible rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 group-hover:visible"
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
              </div>
            )}
          </div>

          <div className="text-sm text-gray-500">
            Created {new Date(project.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="ml-4 flex items-center">
          <GridPreview
            boxes={project.boxes}
            className="border border-gray-200"
            cols={project.cols}
            rows={project.rows}
          />
        </div>
      </div>

      <button
        className="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        disabled={isDeleting}
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M6 18L18 6M6 6l12 12"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </button>
    </div>
  );
}
