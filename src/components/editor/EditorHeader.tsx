'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AppProject } from '@/types';
import { useRouter } from 'next/navigation';

type Props = {
  isLocalProject?: boolean;
  project: AppProject;
};

export function EditorHeader({ project, isLocalProject }: Props) {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="flex w-full items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
          title="Back to projects"
          onClick={() => router.push('/local')}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </button>
        <h1 className="text-lg">{project.name}</h1>
      </div>
    </div>
  );
}
