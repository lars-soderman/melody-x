import { AppProject, Box } from '@/types';
import { useEffect, useState } from 'react';

// import { DownloadButton } from './DownloadButton';
import { updateProject } from '@/app/actions';
import { ExportButton } from '@/components/grid/settings/ExportButton';
import { FontSelector } from '@/components/grid/settings/FontSelector';
import { Popover } from '@/components/ui/Popover';
import { useTranslations } from '@/hooks/useTranslations';
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
  onGridSizeChange,
  onReset,
  project,
  rows,
  updateFont,
}: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [isPublic, setIsPublic] = useState(project.isPublic ?? false);
  const [copySuccess, setCopySuccess] = useState(false);
  const t = useTranslations();

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

  const handlePublicToggle = async () => {
    try {
      await updateProject(project.id, { isPublic: !isPublic });
      setIsPublic(!isPublic);
    } catch (error) {
      console.error('Error updating project visibility:', error);
    }
  };

  const handleShareClick = async () => {
    if (!isPublic) {
      if (confirm('This puzzle needs to be public to share. Make it public?')) {
        await handlePublicToggle();
      } else {
        return;
      }
    }

    const shareUrl = `${window.location.origin}/solve/${project.id}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

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
            <label className="text-sm text-gray-500">
              {t.editor.grid.gridSize}
            </label>
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
              {t.editor.grid.font}
            </label>
            <FontSelector
              id="font-selector"
              value={font}
              onChange={updateFont}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{t.editor.grid.reset}</span>
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
              {t.editor.grid.export}{' '}
              <span className="italic">{t.editor.grid.kryssplan}</span>
            </span>
            <ExportButton {...exportProps} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {t.editor.grid.public}
            </span>
            <button
              className={`relative h-6 w-11 rounded-full transition-colors ${
                isPublic ? 'bg-blue-500' : 'bg-gray-200'
              }`}
              onClick={handlePublicToggle}
            >
              <span
                className={`absolute left-1 top-1 h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPublic ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {copySuccess ? t.editor.grid.linkCopied : t.editor.grid.share}
            </span>
            <button
              className="bg-grey-100 text-grey-700 flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-200"
              onClick={handleShareClick}
            >
              {copySuccess ? (
                <svg
                  className="h-4 w-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              )}
              {/* {copySuccess
                ? t.editor.grid.linkCopied
                : t.editor.grid.shareMelodikryss} */}
            </button>
          </div>
        </div>
      </Popover>
    </div>
  );
}
