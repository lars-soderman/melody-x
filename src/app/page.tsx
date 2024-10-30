'use client';

import { Box } from '@types';
import {
  getId,
  getMaxCol,
  getMaxRow,
  getMinCol,
  getMinRow,
  toGrid,
} from '@utils/grid';
import { useEffect, useState } from 'react';
import { useGridNavigation } from '../hooks/useGridNavigation';
import { useGridReducer } from '../hooks/useGridReducer';
import { AddGridButtons } from './components/AddGridButtons';
import { CrosswordGrid } from './components/CrosswordGrid';
import { RemoveButtons } from './components/RemoveButtons';
import { Settings } from './components/Settings';

export default function Home() {
  const {
    boxes,
    boxSize,
    updateBoxSize,
    addRow,
    addColumn,
    updateLetter,
    updateArrow,
    updateBlack,
    removeRow,
    removeColumn,
    reset,
    updateStop,
  } = useGridReducer();

  const { editingBox, setEditingBox, handleNavigate } =
    useGridNavigation(boxes);

  const [isClient, setIsClient] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [confirmingRemove, setConfirmingRemove] = useState<{
    type: 'row' | 'column';
    index: number;
  } | null>(null);
  const [lastTwoInputs, setLastTwoInputs] = useState<Box[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const minRow = getMinRow(boxes);
  const maxRow = getMaxRow(boxes);
  const minCol = getMinCol(boxes);
  const maxCol = getMaxCol(boxes);

  const grid = toGrid(boxes, minRow, maxRow, minCol, maxCol);

  const handleLetterChange = (id: string, letter: string) => {
    updateLetter(id, letter);

    const currentBox = boxes.find((box) => getId(box) === id);
    if (!currentBox) return;

    // Update last two inputs
    setLastTwoInputs((prev) => [currentBox, ...prev].slice(0, 2));

    // Only auto-navigate if a letter was actually input
    if (letter) {
      // Check if the last two inputs were vertical
      const isVertical =
        lastTwoInputs.length === 2 &&
        lastTwoInputs[0].col === lastTwoInputs[1].col &&
        Math.abs(lastTwoInputs[0].row - lastTwoInputs[1].row) === 1;

      // Navigate down if vertical, right otherwise
      handleNavigate(currentBox, isVertical ? 'down' : 'right');
    }
  };

  if (!isClient) {
    return (
      <main className="absolute inset-0 flex flex-col items-center justify-center bg-white text-black" />
    );
  }

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

  return (
    <main className="h-full overflow-scroll" onClick={handleMainClick}>
      <Settings
        boxSize={boxSize}
        onBoxSizeChange={updateBoxSize}
        onReset={reset}
        exportProps={{
          boxes,
          minRow,
          maxRow,
          minCol,
          maxCol,
        }}
      />

      <div
        id="crossword-grid"
        className="relative mx-auto mt-44 w-fit"
        style={{ width: `${(maxCol - minCol + 1) * boxSize}px` }}
      >
        <CrosswordGrid
          grid={grid}
          minRow={minRow}
          maxRow={maxRow}
          minCol={minCol}
          maxCol={maxCol}
          editingBox={editingBox}
          onSetEditingBox={setEditingBox}
          onNavigate={handleNavigate}
          onLetterChange={handleLetterChange}
          onUpdateArrow={updateArrow}
          onUpdateBlack={updateBlack}
          onUpdateStop={updateStop}
          boxes={boxes}
          handleRemoveRow={handleRemoveRow}
          handleRemoveColumn={handleRemoveColumn}
          boxSize={boxSize}
          confirmingRemove={confirmingRemove}
        />
        <AddGridButtons onAddRow={addRow} onAddColumn={addColumn} />
        <RemoveButtons
          grid={grid}
          minRow={minRow}
          minCol={minCol}
          maxRow={maxRow}
          maxCol={maxCol}
          handleRemoveRow={handleRemoveRow}
          handleRemoveColumn={handleRemoveColumn}
          confirmingRemove={confirmingRemove}
        />
      </div>
    </main>
  );
}
