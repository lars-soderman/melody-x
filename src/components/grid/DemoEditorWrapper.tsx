'use client';

import { createDefaultProject } from '@/constants';
import { AppProject } from '@/types';
import { useLayoutEffect, useState } from 'react';
import { Editor } from './Editor';

const STORAGE_KEY = 'melody-x-demo';

export function DemoEditorWrapper() {
  const [project, setProject] = useState<AppProject | null>(null);

  useLayoutEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setProject(
      saved ? JSON.parse(saved) : createDefaultProject('Demo Project', 'demo')
    );
  }, []);

  if (!project) {
    return null; // or a loading spinner
  }

  const handleProjectChange = (updatedProject: AppProject) => {
    setProject(updatedProject);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProject));
  };

  return (
    <Editor
      initialProject={project}
      renderHeader={() => (
        <div className="flex items-center justify-between">
          <h1 className="text-l">Local project</h1>
          {/* <a
            className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
            href="/login"
          >
            Sign in to save your work
          </a> */}
        </div>
      )}
      onProjectChange={handleProjectChange}
    />
  );
}
