import { Project } from '@/types';
import { useState } from 'react';
import { Popover } from './Popover';

type ProjectsMenuProps = {
  currentProject?: Project;
  onSelectProject: (projectId: string) => void;
  projects: Project[];
};

export function ProjectsMenu({
  currentProject,
  projects,
  onSelectProject,
}: ProjectsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute left-4 top-4">
      <Popover
        align="start"
        isOpen={isOpen}
        trigger={
          <button
            aria-label="Projects"
            className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        }
        onClose={() => setIsOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-700">Projects</h2>
            <button
              aria-label="New project"
              className="rounded p-1 text-gray-400 hover:bg-gray-100"
              onClick={() => {
                //TODO
              }}
            >
              +
            </button>
          </div>

          <div className="flex max-h-[300px] flex-col gap-2 overflow-y-auto">
            {projects.map((project) => (
              <button
                key={project.id}
                className={`flex items-center justify-between rounded p-2 text-left text-sm hover:bg-gray-100 ${project.id === currentProject?.id ? 'bg-gray-50' : ''}`}
                onClick={() => {
                  onSelectProject(project.id);
                  setIsOpen(false);
                }}
              >
                <div>
                  <div className="font-medium">{project.name}</div>
                  <div className="text-xs text-gray-500">
                    Modified {new Date(project.modifiedAt).toLocaleDateString()}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Popover>
    </div>
  );
}
