import { AppProject, Box } from '@/types';
import { useEffect, useState } from 'react';

// import { DownloadButton } from './DownloadButton';
import { ExportButton } from '@/components/grid/settings/ExportButton';
import { FontSelector } from '@/components/grid/settings/FontSelector';
import { SaveToServerButton } from '@/components/projects/SaveToServerButton';
import { Popover } from '@/components/ui/Popover';
import { ResetButton } from './ResetButton';

interface ExportProps {
  boxes: Box[];
  isExporting?: boolean;
  maxCol: number;
  maxRow: number;
  minCol: number;
  minRow: number;
}

interface SettingsProps {
  cols: number;
  exportProps: ExportProps;
  font: string;
  isLocalProject?: boolean;
  onGridSizeChange: (rows: number, cols: number) => void;
  onReset: () => void;
  project: AppProject;
  rows: number;
  showGridResize: boolean;
  toggleGridResize: () => void;
  updateFont: (font: string) => void;
}

export function Settings({
  cols,
  exportProps,
  font,
  isLocalProject,
  onGridSizeChange,
  onReset,
  rows,
  updateFont,
  showGridResize,
  toggleGridResize,
  project,
}: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setIsConfirmingReset(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen]);

  return (
    <div className="absolute right-4 top-4">
      <Popover
        isOpen={isOpen}
        positionX="left"
        trigger={
          <button
            aria-label="Settings"
            className="flex h-10 w-10 items-center justify-center rounded-full text-4xl text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            ⚙
          </button>
        }
        onClose={() => {
          setIsOpen(false);
          setIsConfirmingReset(false);
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm text-gray-500">Grid Size</label>
            <div className="flex items-center gap-2">
              <input
                className="w-10 rounded border border-gray-300 p-1 text-sm"
                max="20"
                min="1"
                type="number"
                value={rows}
                onChange={(e) =>
                  onGridSizeChange(parseInt(e.target.value), cols)
                }
              />
              <span className="text-sm text-gray-500">×</span>
              <input
                className="w-10 rounded border border-gray-300 p-1 text-sm"
                max="20"
                min="1"
                type="number"
                value={cols}
                onChange={(e) =>
                  onGridSizeChange(rows, parseInt(e.target.value))
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <label className="text-sm text-gray-500" htmlFor="font-selector">
              Font
            </label>
            <FontSelector
              id="font-selector"
              value={font}
              onChange={updateFont}
            />
          </div>

          <div className="flex items-center justify-between">
            <label
              className="text-sm text-gray-500"
              htmlFor="grid-resize-toggle"
            >
              Show grid resize controls
            </label>
            <input
              checked={showGridResize}
              className="h-4 w-4 rounded border-gray-300"
              id="grid-resize-toggle"
              type="checkbox"
              onChange={toggleGridResize}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Reset Grid</span>
            <ResetButton
              isConfirming={isConfirmingReset}
              onConfirmingChange={setIsConfirmingReset}
              onReset={() => {
                onReset();
                setIsOpen(false);
                setIsConfirmingReset(false);
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Export <span className="italic">kryssplan</span>
            </span>
            <ExportButton {...exportProps} />
          </div>

          {isLocalProject && <SaveToServerButton project={project} />}
        </div>
      </Popover>
    </div>
  );
}
