import { Box } from '@types';
import { stepsBetween } from './math';

export const getId = (box: Box): string => {
  return `${box.row}-${box.col}`;
};

export const createEmptyGrid = (rows: number, cols: number): Box[][] => {
  return Array(rows)
    .fill(null)
    .map((_, row) =>
      Array(cols)
        .fill(null)
        .map((_, col) => ({
          row,
          col,
          letter: null,
        }))
    );
};

export const isValidLetter = (key: string): boolean => {
  return /^[a-zA-ZåäöÅÄÖéèêëÉÈÊËæøÆØ\u00C0-\u00FF]$/.test(key);
};

export const createInitialBoxes = (rows: number, cols: number): Box[] => {
  const result = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,
      letter: null,
    }))
  )
    .flat()
    .flat();

  return result;
};

export const getMaxRow = (boxes: Box[]) =>
  boxes.length ? Math.max(...boxes.map((box) => box.row)) : 0;

export const getMaxCol = (boxes: Box[]) =>
  boxes.length ? Math.max(...boxes.map((box) => box.col)) : 0;

export const getMinRow = (boxes: Box[]) =>
  boxes.length ? Math.min(...boxes.map((box) => box.row)) : 0;

export const getMinCol = (boxes: Box[]) =>
  boxes.length ? Math.min(...boxes.map((box) => box.col)) : 0;

export const toGrid = (
  boxes: Box[],
  minRow: number,
  maxRow: number,
  minCol: number,
  maxCol: number
): Box[][] => {
  if (!boxes?.length) {
    return [];
  }

  const rowCount = stepsBetween(maxRow, minRow);
  const colCount = stepsBetween(maxCol, minCol);

  return Array.from({ length: rowCount }, (_, rowIndex) => {
    const row = minRow + rowIndex;
    return Array.from({ length: colCount }, (_, colIndex) => {
      const col = minCol + colIndex;
      return (
        boxes.find((b) => b.row === row && b.col === col) || {
          row,
          col,
          letter: null,
        }
      );
    });
  });
};

export const getGridColumnsClass = (numColumns: number) => {
  return `grid-cols-${numColumns}`;
};
