'use client';

import { CrosswordGrid } from '@/components/grid/CrosswordGrid';
import { useGrid } from '@/hooks/useGrid';
import { useGridNavigation } from '@/hooks/useGridNavigation';
import { AppProject, Box } from '@/types';
import {
  getMaxCol,
  getMaxRow,
  getMinCol,
  getMinRow,
  toGrid,
} from '@/utils/grid';
import { useState } from 'react';
import { AddGridButtons } from './AddGridButtons';
import { RemoveButtons } from './RemoveButtons';
import { Settings } from './settings/Settings';

type EditorProps = {
  initialProject: AppProject;
  onProjectChange: (project: AppProject) => void | Promise<void>;
  renderHeader?: () => React.ReactNode;
  showBackButton?: boolean;
};

export function Editor({
  initialProject,
  onProjectChange,
  renderHeader,
  showBackButton,
}: EditorProps) {
  const [confirmingRemove, setConfirmingRemove] = useState<{
    index: number;
    type: 'row' | 'column';
  } | null>(null);
  const [showGridResize, setShowGridResize] = useState(false);

  const {
    boxes,
    rows,
    cols,
    font,
    addColumn,
    addRow,
    removeColumn,
    removeRow,
    updateFont,
    updateGridSize,
    reset,
    updateLetter,
    toggleArrowDown,
    toggleArrowRight,
    toggleBlack,
    toggleHint,
    toggleStopDown,
    toggleStopRight,
  } = useGrid(initialProject, onProjectChange);

  const {
    editingBox,
    setEditingBox,
    handleKeyboardNavigation,
    handleCharacterInput,
  } = useGridNavigation(boxes);

  if (!initialProject) {
    return <div>Loading...</div>;
  }

  const minRow = getMinRow(boxes);
  const maxRow = getMaxRow(boxes);
  const minCol = getMinCol(boxes);
  const maxCol = getMaxCol(boxes);

  const grid = toGrid(boxes, minRow, maxRow, minCol, maxCol);

  const handleLetterChange = (id: string, letter: string) => {
    updateLetter(id, letter);
    if (editingBox) {
      handleCharacterInput(editingBox);
    }
  };

  const handleBoxNavigation = (
    box: Box,
    direction: 'up' | 'down' | 'left' | 'right'
  ) => {
    handleKeyboardNavigation(box, direction);
  };

  const handleRemoveRow = (rowIndex: number) => {
    if (
      confirmingRemove?.type === 'row' &&
      confirmingRemove.index === rowIndex
    ) {
      removeRow(rowIndex);
      setConfirmingRemove(null);
    } else {
      setConfirmingRemove({ type: 'row', index: rowIndex });
    }
  };

  const handleRemoveColumn = (colIndex: number) => {
    if (
      confirmingRemove?.type === 'column' &&
      confirmingRemove.index === colIndex
    ) {
      removeColumn(colIndex);
      setConfirmingRemove(null);
    } else {
      setConfirmingRemove({ type: 'column', index: colIndex });
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col gap-4 p-4"
      onClick={() => setConfirmingRemove(null)}
    >
      {renderHeader?.() || (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <a
                className="rounded bg-gray-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200"
                href="/"
              >
                ← Back to projects
              </a>
            )}
            <h1 className="text-2xl font-bold">{initialProject.name}</h1>
          </div>
        </div>
      )}

      <Settings
        cols={cols}
        font={font}
        project={initialProject}
        rows={rows}
        showGridResize={showGridResize}
        toggleGridResize={() => setShowGridResize(!showGridResize)}
        updateFont={updateFont}
        exportProps={{
          boxes,
          minRow,
          maxRow,
          minCol,
          maxCol,
        }}
        onGridSizeChange={updateGridSize}
        onReset={reset}
      />

      <CrosswordGrid
        boxes={boxes}
        confirmingRemove={confirmingRemove}
        editingBox={editingBox}
        font={font}
        grid={grid}
        handleRemoveColumn={handleRemoveColumn}
        handleRemoveRow={handleRemoveRow}
        maxCol={maxCol}
        maxRow={maxRow}
        minCol={minCol}
        minRow={minRow}
        toggleHint={toggleHint}
        onLetterChange={handleLetterChange}
        onNavigate={handleBoxNavigation}
        onSetEditingBox={setEditingBox}
        onToggleArrowDown={toggleArrowDown}
        onToggleArrowRight={toggleArrowRight}
        onToggleBlack={toggleBlack}
        onToggleStopDown={toggleStopDown}
        onToggleStopRight={toggleStopRight}
      />

      {showGridResize && (
        <>
          <AddGridButtons onAddColumn={addColumn} onAddRow={addRow} />
          <RemoveButtons
            confirmingRemove={confirmingRemove}
            grid={grid}
            handleRemoveColumn={handleRemoveColumn}
            handleRemoveRow={handleRemoveRow}
            maxCol={maxCol}
            maxRow={maxRow}
            minCol={minCol}
            minRow={minRow}
          />
        </>
      )}
    </div>
  );
}
