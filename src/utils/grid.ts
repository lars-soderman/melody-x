import { Box } from '@types';

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
  return /^[a-zA-Z]$/.test(key);
};

export const createInitialBoxes = (rows: number, cols: number): Box[] =>
  Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      letter: null,
      row,
      col,
    }))
  ).flat();

export const getMaxRow = (boxes: Box[]) =>
  Math.max(...boxes.map((box) => box.row));
export const getMaxCol = (boxes: Box[]) =>
  Math.max(...boxes.map((box) => box.col));
export const getMinRow = (boxes: Box[]) =>
  Math.min(...boxes.map((box) => box.row));
export const getMinCol = (boxes: Box[]) =>
  Math.min(...boxes.map((box) => box.col));
