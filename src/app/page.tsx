'use client';

import { BOX_SIZE } from '@/constants';
import { BoxInput } from '@components/BoxInput';
import { Box } from '@types';
import {
  getGridColumnsClass,
  getId,
  getMaxCol,
  getMaxRow,
  getMinCol,
  getMinRow,
  toGrid,
} from '@utils/grid';
import React, { useEffect, useState } from 'react';
import { useGridReducer } from '../hooks/useGridReducer';
import { Settings } from './components/Settings';
import { ShowBox } from './components/ShowBox';

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
  const [editingBox, setEditingBox] = useState<Box | null>(null);
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

  const handleNavigate = (
    currentBox: Box,
    direction: 'up' | 'down' | 'left' | 'right'
  ) => {
    const nextPosition = {
      row:
        currentBox.row +
        (direction === 'up' ? -1 : direction === 'down' ? 1 : 0),
      col:
        currentBox.col +
        (direction === 'left' ? -1 : direction === 'right' ? 1 : 0),
    };

    // Find the next box at the calculated position
    const nextBox = boxes.find(
      (box) => box.row === nextPosition.row && box.col === nextPosition.col
    );

    if (!nextBox) {
      // Hit bottom edge - try moving right
      if (direction === 'down') {
        const rightBox = boxes.find(
          (box) => box.row === currentBox.row && box.col === currentBox.col + 1
        );
        if (rightBox) {
          setEditingBox(rightBox);
        }
      }
      // Hit right edge - try moving down
      else if (direction === 'right') {
        const downBox = boxes.find(
          (box) => box.col === currentBox.col && box.row === currentBox.row + 1
        );
        if (downBox) {
          setEditingBox(downBox);
        }
      }
    } else {
      setEditingBox(nextBox);
    }
  };

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

  // Render a loading state or nothing during server-side rendering
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
      // Clear other confirmation states
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
      // Clear other confirmation states
      setIsConfirmingReset(false);
    }
  };

  // Clear confirmations when clicking outside
  const handleMainClick = () => {
    setIsConfirmingReset(false);
    setConfirmingRemove(null);
  };

  return (
    <main
      className="absolute inset-0 flex flex-col items-center justify-center bg-white text-black"
      onClick={handleMainClick}
    >
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

      <div id="crossword-grid" className="relative flex">
        <div
          className={`grid w-full ${getGridColumnsClass(
            maxCol - minCol + 1
          )} border-collapse gap-0 rounded border-2 border-black`}
        >
          {grid.map((row) =>
            row.map((box) => (
              <React.Fragment key={getId(box)}>
                <div className="relative flex">
                  {editingBox === box ? (
                    <BoxInput
                      id={getId(box)}
                      letter={box.letter}
                      boxSize={boxSize}
                      isSelected={editingBox === box}
                      onLetterChange={handleLetterChange}
                      onArrowDown={() => updateArrow(getId(box), 'down')}
                      onArrowRight={() => updateArrow(getId(box), 'right')}
                      onBlack={() => updateBlack(getId(box), !box.black)}
                      black={box.black}
                      onNavigate={(direction) => handleNavigate(box, direction)}
                      onStopBottom={() => updateStop(getId(box), 'bottom')}
                      onStopRight={() => updateStop(getId(box), 'right')}
                    />
                  ) : (
                    <ShowBox
                      id={getId(box)}
                      letter={box.letter}
                      onClick={() => setEditingBox(box)}
                      row={box.row}
                      col={box.col}
                      arrow={box.arrow}
                      stop={box.stop}
                      black={box.black}
                      hint={box.hint}
                      boxSize={boxSize}
                      onNavigate={(direction) => handleNavigate(box, direction)}
                    />
                  )}
                </div>
                {/* Row remove buttons - show on hover at the edge of each row */}
                {box.col === maxCol && (
                  <div
                    className="group absolute right-0 h-16 w-6 hover:bg-gray-50"
                    style={{
                      top: `${(box.row - minRow) * BOX_SIZE}px`,
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveRow(box.row);
                      }}
                      className={`invisible absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:visible ${
                        confirmingRemove?.type === 'row' &&
                        confirmingRemove.index === box.row
                          ? 'text-red-500'
                          : 'text-gray-400'
                      } hover:bg-gray-200`}
                      aria-label="Remove row"
                    >
                      -
                    </button>
                  </div>
                )}
                {/* Left edge - row remove buttons */}
                {box.col === minCol && (
                  <div
                    className="group absolute left-0 h-16 w-6 hover:bg-gray-50"
                    style={{
                      top: `${(box.row - minRow) * BOX_SIZE}px`,
                      left: '-24px',
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveRow(box.row);
                      }}
                      className={`invisible absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:visible ${
                        confirmingRemove?.type === 'row' &&
                        confirmingRemove.index === box.row
                          ? 'text-red-500'
                          : 'text-gray-400'
                      } hover:bg-gray-200`}
                      aria-label="Remove row"
                    >
                      -
                    </button>
                  </div>
                )}
                {/* Column remove buttons - show on hover at the bottom of each column */}
                {box.row === maxRow && (
                  <div
                    className="group absolute bottom-0 h-6 w-16 hover:bg-gray-50"
                    style={{
                      left: `${(box.col - minCol) * BOX_SIZE}px`,
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveColumn(box.col);
                      }}
                      className={`invisible absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:visible ${
                        confirmingRemove?.type === 'column' &&
                        confirmingRemove.index === box.col
                          ? 'text-red-500'
                          : 'text-gray-400'
                      } hover:bg-gray-200`}
                      aria-label="Remove column"
                    >
                      -
                    </button>
                  </div>
                )}
                {/* Top edge - column remove buttons */}
                {box.row === minRow && (
                  <div
                    className="group absolute top-0 h-6 w-16 hover:bg-gray-50"
                    style={{
                      left: `${(box.col - minCol) * BOX_SIZE}px`,
                      top: '-24px',
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveColumn(box.col);
                      }}
                      className={`invisible absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:visible ${
                        confirmingRemove?.type === 'column' &&
                        confirmingRemove.index === box.col
                          ? 'text-red-500'
                          : 'text-gray-400'
                      } hover:bg-gray-200`}
                      aria-label="Remove column"
                    >
                      -
                    </button>
                  </div>
                )}
              </React.Fragment>
            ))
          )}
        </div>

        {/* Buttons for adding rows and columns */}
        <button
          onClick={() => addRow('top')}
          className="absolute -top-12 left-1/2 h-10 w-full -translate-x-1/2 rounded bg-slate-50 p-2 text-2xl opacity-0 transition-opacity hover:opacity-100"
        >
          +
        </button>
        <button
          onClick={() => addColumn('left')}
          className="absolute -left-12 top-1/2 h-full w-10 -translate-y-1/2 rounded bg-slate-50 p-2 text-2xl opacity-0 transition-opacity hover:opacity-100"
        >
          +
        </button>
        <button
          onClick={() => addRow('bottom')}
          className="absolute -bottom-12 left-1/2 h-10 w-full -translate-x-1/2 rounded bg-slate-50 p-2 text-2xl opacity-0 transition-opacity hover:opacity-100"
        >
          +
        </button>
        <button
          onClick={() => addColumn('right')}
          className="absolute -right-12 top-1/2 h-full w-10 -translate-y-1/2 rounded bg-slate-50 p-2 text-2xl opacity-0 transition-opacity hover:opacity-100"
        >
          +
        </button>
      </div>
    </main>
  );
}
