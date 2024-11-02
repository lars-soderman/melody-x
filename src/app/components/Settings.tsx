import { Box } from '@/types';
import { useEffect, useState } from 'react';
import { BoxSizeControl } from './BoxSizeControl';
import { ExportButton } from './ExportButton';
import { FontSelector } from './FontSelector';
import { Popover } from './Popover';
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
  boxSize: number;
  cols: number;
  exportProps: ExportProps;
  font: string;
  onBoxSizeChange: (size: number) => void;
  onGridSizeChange: (rows: number, cols: number) => void;
  onReset: () => void;
  rows: number;
  updateFont: (font: string) => void;
}

export function Settings({
  boxSize,
  cols,
  exportProps,
  font,
  onBoxSizeChange,
  onGridSizeChange,
  onReset,
  rows,
  updateFont,
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
            <label className="text-sm text-gray-500">Font</label>
            <FontSelector value={font} onChange={updateFont} />
          </div>

          <div className="flex items-center justify-between gap-4">
            <label className="text-sm text-gray-500">Box Size</label>
            <BoxSizeControl size={boxSize} onChange={onBoxSizeChange} />
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
            <span className="text-sm text-gray-500">Export PDF</span>
            <ExportButton {...exportProps} />
          </div>
        </div>
      </Popover>
    </div>
  );
}
