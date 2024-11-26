'use client';

import { createProject } from '@/app/actions';
import { Popover } from '@/components/ui/Popover';
import { createDefaultProject } from '@/constants';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  userId: string;
};

export function CreateProjectButton({ userId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    setIsCreating(true);
    setError(null);

    try {
      const defaultProject = createDefaultProject(projectName.trim(), userId);

      const project = await createProject({
        name: defaultProject.name,
        gridData: {
          boxes: defaultProject.boxes,
          cols: defaultProject.cols,
          rows: defaultProject.rows,
          font: defaultProject.font,
        },
        hints: defaultProject.hints,
        isPublic: false,
        ownerId: userId,
      });

      setProjectName('');
      setIsOpen(false);
      router.push(`/editor/${project.id}`);
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Popover
      isOpen={isOpen}
      trigger={
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          onClick={() => setIsOpen(true)}
        >
          New Project
        </button>
      }
      onClose={() => {
        setIsOpen(false);
        setError(null);
      }}
    >
      <form className="p-4" onSubmit={handleSubmit}>
        <h3 className="mb-4 text-lg font-semibold">Create New Project</h3>
        <input
          autoFocus
          className="mb-4 w-full rounded border border-gray-200 p-2"
          disabled={isCreating}
          placeholder="Project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        {error && <div className="mb-4 text-sm text-red-500">{error}</div>}
        <div className="flex justify-end gap-2">
          <button
            className="rounded bg-gray-100 px-3 py-1 hover:bg-gray-200"
            disabled={isCreating}
            type="button"
            onClick={() => {
              setIsOpen(false);
              setError(null);
            }}
          >
            Cancel
          </button>
          <button
            className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 disabled:opacity-50"
            disabled={isCreating}
            type="submit"
          >
            {isCreating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </Popover>
  );
}
