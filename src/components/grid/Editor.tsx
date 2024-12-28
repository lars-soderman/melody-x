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
import { Settings } from './settings/Settings';

type EditorProps = {
  initialProject: AppProject;

  isSyncing?: boolean;
  onProjectChange: (project: AppProject) => void;
};

export function Editor({
  initialProject,
  isSyncing,
  onProjectChange,
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

  const safeBoxes = boxes || [];

  const minRow = getMinRow(safeBoxes);
  const maxRow = getMaxRow(safeBoxes);
  const minCol = getMinCol(safeBoxes);
  const maxCol = getMaxCol(safeBoxes);

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
      className="flex min-h-screen flex-col gap-4"
      onClick={() => setConfirmingRemove(null)}
    >
      {isSyncing && (
        <div className="absolute right-0 top-0 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
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
    </div>
  );
}
