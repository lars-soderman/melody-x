'use client';

import { CrosswordGrid } from '@/components/grid/CrosswordGrid';
import { createDefaultProject } from '@/constants';
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
import { useEffect, useState } from 'react';
import { AddGridButtons } from './AddGridButtons';
import { RemoveButtons } from './RemoveButtons';
import { Settings } from './settings/Settings';

const STORAGE_KEY = 'melody-x-demo';

export function DemoEditor() {
  const [project, setProject] = useState<AppProject>(
    createDefaultProject('Demo Project', 'demo')
  );
  const [confirmingRemove, setConfirmingRemove] = useState<{
    index: number;
    type: 'row' | 'column';
  } | null>(null);
  const [showGridResize, setShowGridResize] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setProject(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever project changes
  const handleProjectChange = (updatedProject: AppProject) => {
    setProject(updatedProject);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProject));
  };

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
  } = useGrid(project, handleProjectChange);

  const {
    editingBox,
    setEditingBox,
    handleKeyboardNavigation,
    handleCharacterInput,
  } = useGridNavigation(boxes);

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

  const handleMainClick = () => {
    setConfirmingRemove(null);
  };

  return (
    <div
      className="flex min-h-screen flex-col gap-4 p-4"
      onClick={handleMainClick}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Demo Editor</h1>
        <a
          className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          href="/login"
        >
          Sign in to save your work
        </a>
      </div>

      <div className="flex flex-wrap gap-4">
        <Settings
          cols={cols}
          font={font}
          project={project}
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
        />{' '}
      </div>

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
