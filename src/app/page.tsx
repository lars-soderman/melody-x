'use client';

import { BoxInput } from '@components/BoxInput';
import { ExportButton } from '@components/ExportButton';
import { Box } from '@types';
import { getId, getMaxCol, getMaxRow, getMinCol, getMinRow } from '@utils/grid';
import React, { useEffect, useState } from 'react';
import { useGridReducer } from '../hooks/useGridReducer';
import { ShowBox } from './components/ShowBox';

// Utility to get minimum and maximum rows and columns

const stepsBetween = (num1: number, num2: number) => {
  return Math.abs(num1 - num2) + 1;
};

const toGrid = (
  boxes: Box[],
  minRow: number,
  maxRow: number,
  minCol: number,
  maxCol: number
): Box[][] => {
  const rowCount = stepsBetween(maxRow, minRow);
  const colCount = stepsBetween(maxCol, minCol);

  return Array.from({ length: rowCount }, (_, rowIndex) => {
    const row = minRow + rowIndex;
    return Array.from({ length: colCount }, (_, colIndex) => {
      const col = minCol + colIndex;
      return (
        boxes.find((b) => b.row === row && b.col === col) || {
          letter: null,
          row,
          col,
        }
      );
    });
  });
};

const getGridColumnsClass = (numColumns: number) => {
  return `grid-cols-${numColumns}`;
};

const BOX_SIZE = 64;

export default function Home() {
  const {
    boxes,
    addRow,
    addColumn,
    updateLetter,
    updateArrow,
    updateBlack,
    removeRow,
    removeColumn,
    reset,
  } = useGridReducer();
  const [editingBox, setEditingBox] = useState<Box | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const minRow = getMinRow(boxes);
  const maxRow = getMaxRow(boxes);
  const minCol = getMinCol(boxes);
  const maxCol = getMaxCol(boxes);

  const grid = toGrid(boxes, minRow, maxRow, minCol, maxCol);

  // Render a loading state or nothing during server-side rendering
  if (!isClient) {
    return (
      <main className="absolute inset-0 flex flex-col items-center justify-center bg-white text-black" />
    );
  }

  return (
    <main
      className="absolute inset-0 flex flex-col items-center justify-center bg-white text-black"
      onClick={() => isConfirmingReset && setIsConfirmingReset(false)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (isConfirmingReset) {
            reset();
            setIsConfirmingReset(false);
          } else {
            setIsConfirmingReset(true);
          }
        }}
        className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full text-xl text-gray-400 transition-colors hover:bg-gray-200"
        aria-label={
          isConfirmingReset
            ? 'Confirm reset grid'
            : 'Reset grid to initial state'
        }
      >
        {isConfirmingReset ? '×' : '⟲'}
      </button>
      <ExportButton
        boxes={boxes}
        minRow={minRow}
        maxRow={maxRow}
        minCol={minCol}
        maxCol={maxCol}
      />

      <div id="crossword-grid" className="relative flex">
        <div
          className={`grid w-full ${getGridColumnsClass(
            maxCol - minCol + 1
          )} border-collapse gap-0 border-2 border-black`}
        >
          {grid.map((row) =>
            row.map((box) => (
              <React.Fragment key={getId(box)}>
                <div className="relative flex">
                  {editingBox === box ? (
                    <BoxInput
                      id={getId(box)}
                      letter={box.letter}
                      isSelected={editingBox === box}
                      onLetterChange={updateLetter}
                      onArrowDown={() => updateArrow(getId(box), 'down')}
                      onArrowRight={() => updateArrow(getId(box), 'right')}
                      onBlack={() => updateBlack(getId(box), !box.black)}
                      black={box.black}
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
                    />
                  )}
                </div>
                {/* Row remove buttons - show at the end of each row */}
                {box.col === maxCol && (
                  <button
                    onClick={() => removeRow(box.row)}
                    style={{
                      top: `${(box.row - minRow) * BOX_SIZE + BOX_SIZE / 4 + 6}px`,
                      right: '-10px',
                    }}
                    className="absolute flex h-6 w-6 items-center justify-center rounded border-4 border-white bg-slate-200 text-2xl opacity-0 transition-opacity duration-200 hover:opacity-100"
                  >
                    -
                  </button>
                )}
                {/* Column remove buttons - show at the bottom of each column */}
                {box.row === maxRow && (
                  <button
                    onClick={() => removeColumn(box.col)}
                    style={{
                      left: `${(box.col - minCol) * BOX_SIZE + BOX_SIZE / 4 + 6}px`,
                    }}
                    className="absolute -bottom-2 flex h-6 w-6 items-center justify-center rounded border-4 border-white bg-slate-200 text-2xl opacity-0 transition-opacity duration-200 hover:opacity-100"
                  >
                    -
                  </button>
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
