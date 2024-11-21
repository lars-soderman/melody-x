'use client';

import { Popover } from '@/components/ui/Popover';
import { useState } from 'react';

type Props = {
  onCreate: (name: string) => void;
};

export function CreateLocalProjectButton({ onCreate }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      onCreate(projectName.trim());
      setProjectName('');
      setIsOpen(false);
    }
  };

  return (
    <Popover
      isOpen={isOpen}
      trigger={
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          onClick={() => setIsOpen(true)}
        >
          Create New Local Project
        </button>
      }
      onClose={() => setIsOpen(false)}
    >
      <form className="p-4" onSubmit={handleSubmit}>
        <h3 className="mb-4 text-lg font-semibold">Create New Local Project</h3>
        <input
          autoFocus
          className="mb-4 w-full rounded border border-gray-200 p-2"
          placeholder="Project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            className="rounded bg-gray-100 px-3 py-1 hover:bg-gray-200"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
            type="submit"
          >
            Create
          </button>
        </div>
      </form>
    </Popover>
  );
}
