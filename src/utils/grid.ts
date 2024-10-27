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
