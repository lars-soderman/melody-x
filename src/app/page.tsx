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
    rows,
    cols,
    updateBoxSize,
    updateGridSize,
    addRow,
    addColumn,
    updateLetter,
    updateArrow,
    updateBlack,
    removeRow,
    removeColumn,
    reset,
    updateStop,
    toggleHint,
  } = useGridReducer();

  const { editingBox, setEditingBox, handleNavigate } =
    useGridNavigation(boxes);

  const [isClient, setIsClient] = useState(false);
  const [_, setIsConfirmingReset] = useState(false);
  const [confirmingRemove, setConfirmingRemove] = useState<{
    index: number;
    type: 'row' | 'column';
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
        cols={cols}
        rows={rows}
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

      <div
        className="relative mx-auto mt-44 w-fit"
        id="crossword-grid"
        style={{ width: `${(maxCol - minCol + 1) * boxSize}px` }}
      >
        <CrosswordGrid
          boxes={boxes}
          boxSize={boxSize}
          confirmingRemove={confirmingRemove}
          editingBox={editingBox}
          grid={grid}
          handleRemoveColumn={handleRemoveColumn}
          handleRemoveRow={handleRemoveRow}
          maxCol={maxCol}
          maxRow={maxRow}
          minCol={minCol}
          minRow={minRow}
          toggleHint={toggleHint}
          onLetterChange={handleLetterChange}
          onNavigate={handleNavigate}
          onSetEditingBox={setEditingBox}
          onUpdateArrow={updateArrow}
          onUpdateBlack={updateBlack}
          onUpdateStop={updateStop}
        />
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
      </div>
    </main>
  );
}
