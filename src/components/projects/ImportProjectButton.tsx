'use client';

import { AppProject } from '@/types';
import { useRef } from 'react';

type Props = {
  onImport: (project: AppProject) => void;
};

export function ImportProjectButton({ onImport }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const project = JSON.parse(text) as AppProject;

      // Add timestamp to ensure unique ID
      project.id = `new-${Date.now()}`;

      onImport(project);

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error importing project:', error);
      alert('Invalid project file');
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        accept=".json"
        className="hidden"
        type="file"
        onChange={handleImport}
      />
      <button
        className="rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
        onClick={() => fileInputRef.current?.click()}
      >
        Import from JSON
      </button>
    </div>
  );
}
