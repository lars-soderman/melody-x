'use client';

import { createProject } from '@/app/actions';
import { createDefaultProject } from '@/constants';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  userId: string;
};

export function CreateProjectButton({ userId }: Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreate = async () => {
    setIsCreating(true);
    setError(null);

    try {
      const defaultProject = createDefaultProject('New Project', userId);

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

      router.push(`/editor/${project.id}`);
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div>
      <button
        className="rounded bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
        disabled={isCreating}
        onClick={handleCreate}
      >
        {isCreating ? 'Creating...' : 'Create New Project on Server'}
      </button>
      {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
    </div>
  );
}
