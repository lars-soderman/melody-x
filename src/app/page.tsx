'use client';
import { BoxInput } from '@components/BoxInput';
import { Box } from '@types';
import { getId } from '@utils/grid';
import React, { useState } from 'react';
import { ShowBox } from './components/ShowBox';

const createInitialBoxes = (rows: number, cols: number): Box[] =>
  Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      letter: null,
      row,
      col,
    }))
  ).flat();

// Utility to get minimum and maximum rows and columns
const getMaxRow = (boxes: Box[]) => Math.max(...boxes.map((box) => box.row));
const getMaxCol = (boxes: Box[]) => Math.max(...boxes.map((box) => box.col));
const getMinRow = (boxes: Box[]) => Math.min(...boxes.map((box) => box.row));
const getMinCol = (boxes: Box[]) => Math.min(...boxes.map((box) => box.col));

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
  const [boxes, setBoxes] = useState<Box[]>(createInitialBoxes(9, 10));
  const [editingBox, setEditingBox] = useState<Box | null>(null);

  const minRow = getMinRow(boxes);
  const maxRow = getMaxRow(boxes);
  const minCol = getMinCol(boxes);
  const maxCol = getMaxCol(boxes);

  const grid = toGrid(boxes, minRow, maxRow, minCol, maxCol);

  const addRow = (position: 'top' | 'bottom') => {
    if (position === 'top') {
      setBoxes((prevBoxes) =>
        prevBoxes.map((box) => ({ ...box, row: box.row + 1 }))
      );
    }

    const newRowIndex = position === 'top' ? minRow : maxRow + 1;
    const newRow = Array.from(
      { length: stepsBetween(maxCol, minCol) },
      (_, colIndex) => ({
        letter: null,
        row: newRowIndex,
        col: colIndex + minCol,
      })
    );
    setBoxes((prevBoxes) => [...prevBoxes, ...newRow]);
  };

  const addColumn = (position: 'left' | 'right') => {
    if (position === 'left') {
      setBoxes((prevBoxes) =>
        prevBoxes.map((box) => ({ ...box, col: box.col + 1 }))
      );
    }

    const newColIndex = position === 'left' ? minCol : maxCol + 1;
    const newCol = Array.from(
      { length: stepsBetween(maxRow, minRow) },
      (_, rowIndex) => ({
        letter: null,
        row: rowIndex + minRow,
        col: newColIndex,
      })
    );
    setBoxes((prevBoxes) => [...prevBoxes, ...newCol]);
  };

  const updateBoxLetter = (id: string, newLetter: string) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) =>
        getId(box) === id ? { ...box, letter: newLetter.toUpperCase() } : box
      )
    );
    setEditingBox(null);
  };

  const removeRow = (rowIndex: number) => {
    setBoxes((prevBoxes) => {
      // First remove the target row
      const filtered = prevBoxes.filter((box) => box.row !== rowIndex);
      // Then shift all rows above the removed row down by 1
      return filtered.map((box) => ({
        ...box,
        row: box.row > rowIndex ? box.row - 1 : box.row,
      }));
    });
  };

  const removeColumn = (colIndex: number) => {
    setBoxes((prevBoxes) => {
      // First remove the target column
      const filtered = prevBoxes.filter((box) => box.col !== colIndex);
      // Then shift all columns to the right of the removed column left by 1
      return filtered.map((box) => ({
        ...box,
        col: box.col > colIndex ? box.col - 1 : box.col,
      }));
    });
  };

  const updateBoxArrow = (id: string, arrow: Box['arrow']) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) => (getId(box) === id ? { ...box, arrow } : box))
    );
  };

  const updateBoxBlack = (id: string, black: boolean) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) => (getId(box) === id ? { ...box, black } : box))
    );
  };

  return (
    <main className="absolute inset-0 flex flex-col items-center justify-center bg-white text-black">
      <div className="relative flex">
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
                      onLetterChange={updateBoxLetter}
                      onArrowDown={() => updateBoxArrow(getId(box), 'down')}
                      onArrowRight={() => updateBoxArrow(getId(box), 'right')}
                      onBlack={() => updateBoxBlack(getId(box), !box.black)}
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
                      top: `${(box.row - minRow) * BOX_SIZE + BOX_SIZE / 4}px`,
                    }}
                    className="absolute -right-1 flex h-10 w-4 items-center justify-center rounded border-2 border-black bg-slate-50 text-2xl opacity-0 transition-opacity duration-200 hover:opacity-100"
                  >
                    -
                  </button>
                )}
                {/* Column remove buttons - show at the bottom of each column */}
                {box.row === maxRow && (
                  <button
                    onClick={() => removeColumn(box.col)}
                    style={{
                      left: `${(box.col - minCol) * BOX_SIZE + BOX_SIZE / 4}px`,
                    }}
                    className="absolute -bottom-1 flex h-4 w-10 items-center justify-center rounded border-2 border-black bg-slate-50 text-2xl opacity-0 transition-opacity duration-200 hover:opacity-100"
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
