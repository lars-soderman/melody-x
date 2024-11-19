import { AppProject } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';

type ProjectCardMenuProps = {
  onDelete: () => void;
  onRename: () => void;
  project: AppProject;
};

export function ProjectCardMenu({
  onDelete,
  onRename,
  project,
}: ProjectCardMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent navigation when clicking menu
      setIsOpen(!isOpen);
    },
    [isOpen]
  );

  return (
    <div ref={menuRef} className="relative">
      <button
        className="absolute right-2 top-2 rounded-full p-1 opacity-0 transition-opacity hover:bg-gray-100 group-hover:opacity-100"
        onClick={handleMenuClick}
      >
        <svg
          className="h-5 w-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M6 12h.01M12 12h.01M18 12h.01M6 12a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2z"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-50 w-56 rounded-lg border bg-white p-1 shadow-lg">
          <div className="space-y-0.5">
            <button
              className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100"
              onClick={onRename}
            >
              Rename
            </button>
            <button
              className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide details' : 'Show details'}
            </button>
            <button
              className="w-full rounded px-2 py-1.5 text-left text-sm text-red-600 hover:bg-red-50"
              onClick={onDelete}
            >
              Delete
            </button>
          </div>

          {showDetails && (
            <>
              <div className="my-1 border-t" />
              <div className="space-y-2 p-2 text-sm">
                <div>
                  <div className="text-gray-500">Created</div>
                  <div>{new Date(project.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-500">Last modified</div>
                  <div>{new Date(project.updatedAt).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-500">Grid size</div>
                  <div>
                    {project.rows}×{project.cols}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Hints</div>
                  <div>{project.hints.length}</div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
