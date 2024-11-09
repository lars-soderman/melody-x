import { Project } from '@/types';
import { useRef } from 'react';

type ImportButtonProps = {
  onImport: (project: Project) => void;
};

export function ImportButton({ onImport }: ImportButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const project: Project = JSON.parse(text);
      if (
        !project.id ||
        !project.name ||
        !project.boxes ||
        !project.rows ||
        !project.cols
      ) {
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

  return (
    <>
      <input
        ref={fileInputRef}
        accept=".json"
        className="hidden"
        type="file"
        onChange={handleImport}
      />
      <button
        aria-label="Import project from JSON"
        className="flex w-8 rounded p-1 text-gray-400 hover:bg-gray-100"
        title="Import project from JSON"
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
      >
        <svg
          className="m-auto h-4 w-4"
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
      </button>
    </>
  );
}
