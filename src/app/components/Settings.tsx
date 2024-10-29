import { Box } from '@/types';
import { useEffect, useState } from 'react';
import { BoxSizeControl } from './BoxSizeControl';
import { ExportButton } from './ExportButton';
import { Popover } from './Popover';
import { ResetButton } from './ResetButton';

interface ExportProps {
  isExporting?: boolean;
  boxes: Box[];
  minRow: number;
  maxRow: number;
  minCol: number;
  maxCol: number;
}

interface SettingsProps {
  boxSize: number;
  onBoxSizeChange: (size: number) => void;
  onReset: () => void;
  exportProps: ExportProps;
}

export function Settings({
  boxSize,
  onBoxSizeChange,
  onReset,
  exportProps,
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
        onClose={() => {
          setIsOpen(false);
          setIsConfirmingReset(false);
        }}
        trigger={
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-3xl text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
            aria-label="Settings"
          >
            ⚙
          </button>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Grid Size</span>
            {typeof boxSize === 'number' && !isNaN(boxSize) && (
              <BoxSizeControl size={boxSize} onChange={onBoxSizeChange} />
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Reset Grid</span>
            <ResetButton
              isConfirming={isConfirmingReset}
              onReset={onReset}
              onConfirmingChange={setIsConfirmingReset}
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
