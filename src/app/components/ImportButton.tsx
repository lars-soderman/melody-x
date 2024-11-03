import { Project } from '@/types';
import { useEffect, useRef } from 'react';

type ImportButtonProps = {
  onImport: (project: Project) => void;
};

export function ImportButton({ onImport }: ImportButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    console.log('handleImport triggered');
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const project: Project = JSON.parse(text);
      if (!project.id || !project.name || !project.boxes) {
        throw new Error('Invalid project file');
      }

      project.id = crypto.randomUUID();
      project.createdAt = new Date().toISOString();
      project.modifiedAt = new Date().toISOString();

      onImport(project);
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import project. Please check the file format.');
    }
  };

  useEffect(() => {
    console.log('fileInputRef value:', fileInputRef.current);
  }, [fileInputRef]);

  return (
    <div className="w-full" onClick={(e) => e.stopPropagation()}>
      <input
        ref={fileInputRef}
        accept=".json"
        className="hidden"
        type="file"
        onChange={handleImport}
      />
      <button
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Import from JSON
      </button>
    </div>
  );
}
