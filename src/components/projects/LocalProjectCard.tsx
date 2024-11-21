'use client';

import { AppProject } from '@/types';
import { useRouter } from 'next/navigation';

type Props = {
  onDelete: () => void;
  project: AppProject;
};

export function LocalProjectCard({ project, onDelete }: Props) {
  const router = useRouter();

  return (
    <div
      className="group relative cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md"
      onClick={() => router.push(`/local/${project.id}`)}
    >
      <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          className="rounded bg-red-100 p-2 text-red-600 hover:bg-red-200"
          title="Delete"
          onClick={(e) => {
            e.stopPropagation();
            if (
              window.confirm('Are you sure you want to delete this project?')
            ) {
              onDelete();
            }
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

      <h3 className="mb-2 font-semibold">{project.name}</h3>
      <div className="text-sm text-gray-600">
        Created {new Date(project.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
