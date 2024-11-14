'use client';

import Link from 'next/link';

import { AddGridButtons } from '@/app/components/AddGridButtons';
import { CrosswordGrid } from '@/app/components/CrosswordGrid';
import { HintNotepad } from '@/app/components/HintNotepad';
import { RemoveButtons } from '@/app/components/RemoveButtons';
import { Settings } from '@/app/components/Settings';
import { INITIAL_BOX_SIZE } from '@/constants';
import { useGridNavigation } from '@/hooks/useGridNavigation';
import { useGridReducer } from '@/hooks/useGridReducer';
import { useHintReducer } from '@/hooks/useHintReducer';
import { getProjectDB, updateProjectDB } from '@/services/projects';
import { Box, Hint, Project } from '@/types';
import {
  getId,
  getMaxCol,
  getMaxRow,
  getMinCol,
  getMinRow,
  toGrid,
} from '@/utils/grid';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function EditorPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const router = useRouter();

  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [confirmingRemove, setConfirmingRemove] = useState<{
    index: number;
    type: 'row' | 'column';
  } | null>(null);
  const [showGridResize, setShowGridResize] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectDB(projectId as string);
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
        router.push('/projects');
      }
    };

    fetchProject();
  }, [projectId, router]);

  const saveProject = useCallback(async (updatedProject: Project) => {
    try {
      await updateProjectDB(updatedProject.id, updatedProject);
      console.log('Project saved successfully');
    } catch (error) {
      console.error('Error saving project:', error);
    }
  }, []);

  // Handle hints updates
  const updateHints = useCallback(
    (hints: Hint[]) => {
      if (!project) return;
      const updatedProject = { ...project, hints };
      setProject(updatedProject);
      saveProject(updatedProject);
    },
    [project, saveProject]
  );

  // Initialize hint reducer
  const { hints, addHint, updateHintText, removeHint, getNextAvailableNumber } =
    useHintReducer(project?.hints ?? [], updateHints);

  const {
    boxes,

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
    updateStopDown,
    updateStopRight,
    setHint,
    updateFont,
  } = useGridReducer(project ?? null, saveProject, getNextAvailableNumber);

  const {
    editingBox,
    setEditingBox,
    handleKeyboardNavigation,
    handleCharacterInput,
  } = useGridNavigation(boxes);

  //   const debouncedSaveProject = useDebounce(saveProject, 2000);

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

  const activeHint = editingBox?.hint
    ? hints.find((h) => h.boxId === getId(editingBox))
    : null;

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
        onBoxSizeChange={updateBoxSize}
        onGridSizeChange={updateGridSize}
        onReset={reset}
      />

      <main className="h-full overflow-scroll pb-16" onClick={handleMainClick}>
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
            toggleHint={onToggleHint}
            onLetterChange={handleLetterChange}
            onNavigate={handleBoxNavigation}
            onSetEditingBox={setEditingBox}
            onUpdateArrowDown={updateArrowDown}
            onUpdateArrowRight={updateArrowRight}
            onUpdateBlack={updateBlack}
            onUpdateStopDown={updateStopDown}
            onUpdateStopRight={updateStopRight}
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

      {activeHint && (
        <HintNotepad
          hint={activeHint}
          onRemove={removeHint}
          onTextChange={updateHintText}
        />
      )}
    </div>
  );
}
