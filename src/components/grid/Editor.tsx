'use client';
import { updateProject } from '@/app/actions';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { CrosswordGrid } from '@/components/grid/CrosswordGrid';
import { INITIAL_BOX_SIZE } from '@/constants';
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
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { AddGridButtons } from './AddGridButtons';
import { RemoveButtons } from './RemoveButtons';
import { Settings } from './settings/Settings';

export function Editor({ project }: { project: AppProject }) {
  const [confirmingRemove, setConfirmingRemove] = useState<{
    index: number;
    type: 'row' | 'column';
  } | null>(null);
  const [showGridResize, setShowGridResize] = useState(false);

  const saveProject = useCallback(async (updatedProject: AppProject) => {
    try {
      const projectData: Partial<AppProject> = {
        name: updatedProject.name,
        boxes: updatedProject.boxes,
        cols: updatedProject.cols,
        font: updatedProject.font,
        rows: updatedProject.rows,
        hints: updatedProject.hints.map((hint) => ({
          ...hint,
          direction: hint.direction === 'vertical' ? 'vertical' : 'horizontal',
        })),
        isPublic: updatedProject.isPublic,
      };

      await updateProject(updatedProject.id, projectData);
      console.log('Project saved successfully');
    } catch (error) {
      console.error('Error saving project:', error);
    }
  }, []);

  const {
    boxes,
    rows,
    cols,
    updateGridSize,
    addRow,
    addColumn,
    updateLetter,
    toggleArrowDown,
    toggleArrowRight,
    toggleBlack,
    removeRow,
    removeColumn,
    reset,
    font,
    toggleStopDown,
    toggleStopRight,
    toggleHint,
    updateFont,
  } = useGrid(project ?? null, saveProject);
  const {
    editingBox,
    setEditingBox,
    handleKeyboardNavigation,
    handleCharacterInput,
  } = useGridNavigation(boxes);

  if (!project) {
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

  const handleMainClick = () => {
    setConfirmingRemove(null);
  };

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="relative min-h-screen">
          <Link
            className="absolute left-4 top-4 rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100"
            href="/"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 19l-7-7 7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <span className="sr-only">Back to projects</span>
          </Link>

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
          />

          <main
            className="h-full overflow-scroll pb-16"
            onClick={handleMainClick}
          >
            <div
              className="relative mx-auto mt-44 w-fit"
              style={{ width: `${(maxCol - minCol + 1) * INITIAL_BOX_SIZE}px` }}
            >
              <h2 className="absolute -top-8 text-sm text-gray-500 dark:text-gray-400">
                {project.name}
              </h2>
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
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
