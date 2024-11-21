'use client';

import { createProject } from '@/app/actions';
import { useAuth } from '@/contexts/AuthContext';
import { mapProjectFromDB } from '@/lib/mappers';
import { AppProject } from '@/types';
import { useRouter } from 'next/navigation';

type Props = {
  project: AppProject;
};

export function SaveToServerButton({ project }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  const handleSaveToServer = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const createInput = {
        name: project.name,
        ownerId: user.id,
        gridData: {
          boxes: project.boxes,
          cols: project.cols,
          rows: project.rows,
          font: project.font,
        },
        hints: project.hints,
        isPublic: false,
      };

      const prismaProject = await createProject(createInput);
      const serverProject = mapProjectFromDB(prismaProject);

      // Redirect to the new server project
      router.push(`/editor/${serverProject.id}`);
    } catch (error) {
      console.error('Error saving to server:', error);
      alert('Failed to save project to server');
    }
  };

  return (
    <button
      className="flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      onClick={handleSaveToServer}
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </svg>
      Save to Server
    </button>
  );
}
