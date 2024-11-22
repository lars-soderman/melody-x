'use client';

import { GridPreview } from '@/components/grid/GridPreview';
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
      className="relative h-32 overflow-hidden rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md"
      onClick={() => router.push(`/local/${project.id}`)}
    >
      <div className="flex h-full cursor-pointer">
        <div className="flex flex-1 flex-col justify-between">
          <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">
            {project.name}
          </h3>
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
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm('Are you sure you want to delete this project?')) {
            onDelete();
          }
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
