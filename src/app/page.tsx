'use client';

import { useHintReducer } from '@/hooks/useHintReducer';
import { Box, Hint } from '@types';
import {
  getId,
  getMaxCol,
  getMaxRow,
  getMinCol,
  getMinRow,
  toGrid,
} from '@utils/grid';
import { useCallback, useEffect, useState } from 'react';
import { useGridNavigation } from '../hooks/useGridNavigation';
import { useGridReducer } from '../hooks/useGridReducer';
import { useProjectsReducer } from '../hooks/useProjectsReducer';
import { AddGridButtons } from './components/AddGridButtons';
import { CrosswordGrid } from './components/CrosswordGrid';
import { HintNotepad } from './components/HintNotepad';
import { ProjectsMenu } from './components/ProjectsMenu';
import { RemoveButtons } from './components/RemoveButtons';
import { Settings } from './components/Settings';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const {
    currentProject,
    loadProjects,
    updateProject,
    projects,
    createProject,
    setCurrentProjectId,
    deleteProject,
    importProject,
  } = useProjectsReducer();

  useEffect(() => {
    const init = async () => {
      await loadProjects();
      setIsLoading(false);
    };
    init();
  }, [loadProjects]);

  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [confirmingRemove, setConfirmingRemove] = useState<{
    index: number;
    type: 'row' | 'column';
  } | null>(null);

  const updateHints = useCallback(
    (hints: Hint[]) => {
      if (!currentProject) return;
      updateProject({
        ...currentProject,
        hints,
      });
    },
    [currentProject, updateProject]
  );

  const { hints, addHint, updateHintText, removeHint, getNextAvailableNumber } =
    useHintReducer(currentProject?.hints ?? [], updateHints);

  const {
    boxes,
    boxSize,
    rows,
    cols,
    updateBoxSize,
    updateGridSize,
    addRow,
    addColumn,
    updateLetter,
    updateArrowDown,
    updateArrowRight,
    updateBlack,
    removeRow,
    removeColumn,
    reset,
    font,
    updateStop,
    setHint,
    updateFont,
  } = useGridReducer(
    currentProject ?? null,
    updateProject,
    getNextAvailableNumber
  );

  const {
    editingBox,
    setEditingBox,
    handleKeyboardNavigation,
    handleCharacterInput,
  } = useGridNavigation(boxes);

  const activeHint = editingBox?.hint
    ? hints.find((h) => h.boxId === getId(editingBox))
    : null;

  const [showGridResize, setShowGridResize] = useState(false);

  if (isLoading || !currentProject || !boxes) {
    return (
      <main className="absolute inset-0 flex flex-col items-center justify-center bg-white text-black">
        <div>Loading...</div>
      </main>
    );
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
      setIsConfirmingReset(false);
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
      setIsConfirmingReset(false);
    }
  };

  const handleMainClick = () => {
    setIsConfirmingReset(false);
    setConfirmingRemove(null);
  };

  const onToggleHint = (boxId: string) => {
    const box = boxes.find((b) => getId(b) === boxId);
    if (!box) return;
    const hint = hints.find((h) => h.boxId === boxId);
    // if (!hint) return;

    if (box.hint) {
      // If box already has a hint, remove it from both reducers
      setHint(boxId, undefined);
      removeHint(hint?.id ?? '');
    } else {
      // Get direction based on arrows or default to horizontal
      const direction = 'vertical';

      // Calculate word length based on direction
      const length =
        direction === 'vertical'
          ? boxes.filter(
              (b) => b.col === box.col && b.row >= box.row && !b.black
            ).length
          : boxes.filter(
              (b) => b.row === box.row && b.col >= box.col && !b.black
            ).length;

      // Add hint first to get the number
      const hintNumber = addHint(boxId, direction, length);

      // Then update the grid with the hint number
      setHint(boxId, hintNumber);
    }
  };

  return (
    <div className="relative min-h-screen">
      <ProjectsMenu
        createProject={createProject}
        currentProject={currentProject}
        deleteProject={deleteProject}
        importProject={importProject}
        projects={projects}
        updateProject={updateProject}
        onSelectProject={setCurrentProjectId}
      />
      <Settings
        boxSize={boxSize}
        cols={cols}
        font={font}
        project={currentProject}
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
        onBoxSizeChange={updateBoxSize}
        onGridSizeChange={updateGridSize}
        onReset={reset}
      />

      <main className="h-full overflow-scroll pb-16" onClick={handleMainClick}>
        <div
          className="relative mx-auto mt-44 w-fit"
          style={{ width: `${(maxCol - minCol + 1) * boxSize}px` }}
        >
          <h2 className="absolute -top-8 text-sm text-gray-500 dark:text-gray-400">
            {currentProject?.name}
          </h2>
          <CrosswordGrid
            boxes={boxes}
            boxSize={boxSize}
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
            toggleHint={onToggleHint}
            onLetterChange={handleLetterChange}
            onNavigate={handleBoxNavigation}
            onSetEditingBox={setEditingBox}
            onUpdateArrowDown={updateArrowDown}
            onUpdateArrowRight={updateArrowRight}
            onUpdateBlack={updateBlack}
            onUpdateStop={updateStop}
          />
          {showGridResize && (
            <>
              <AddGridButtons onAddColumn={addColumn} onAddRow={addRow} />
              <RemoveButtons
                boxSize={boxSize}
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
      </main>

      {activeHint && (
        <HintNotepad
          hint={activeHint}
          onRemove={removeHint}
          onTextChange={updateHintText}
        />
      )}

      <a
        aria-label="View source on GitHub"
        className="fixed bottom-4 right-4 text-gray-400 transition-colors hover:text-gray-600"
        href="https://github.com/lars-soderman/melody-x"
        rel="noopener noreferrer"
        target="_blank"
      >
        <svg
          aria-hidden="true"
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      </a>
    </div>
  );
}
