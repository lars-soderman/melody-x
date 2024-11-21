'use client';

import { AppProject } from '@/types';

type Props = {
  project: AppProject;
};

export function EditorHeader({ project }: Props) {
  return (
    <div className="mb-4 flex w-full items-center justify-between">
      <button
        className="flex items-center gap-2 rounded bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
        onClick={() => window.history.back()}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
        Back
      </button>
      <h1 className="text-xl font-bold">{project.name}</h1>
    </div>
  );
}
