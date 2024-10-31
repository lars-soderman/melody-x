'use client';

import { INITIAL_BOX_SIZE, INITIAL_GRID_SIZE } from '@/constants';
import { Box } from '@types';
import { createInitialBoxes, getId } from '@utils/grid';
import { useCallback, useEffect, useReducer } from 'react';

const STORAGE_KEY = 'melodikryss-state';
const STORAGE_VERSION = 1;

type GridState = {
  boxSize: number;
  boxes: Box[];
  cols: number;
  rows: number;
  version: number;
};

type GridAction =
  | { id: string; letter: string; type: 'UPDATE_LETTER' }
  | { arrow: Box['arrow']; id: string; type: 'UPDATE_ARROW' }
  | { black: boolean; id: string; type: 'UPDATE_BLACK' }
  | { rowIndex: number; type: 'REMOVE_ROW' }
  | { colIndex: number; type: 'REMOVE_COLUMN' }
  | { position: 'top' | 'bottom'; type: 'ADD_ROW' }
  | { position: 'left' | 'right'; type: 'ADD_COLUMN' }
  | { size: number; type: 'UPDATE_BOX_SIZE' }
  | { type: 'RESET' }
  | { id: string; stop: Box['stop']; type: 'UPDATE_STOP' }
  | { hint?: number; id: string; type: 'SET_HINT' }
  | { cols: number; rows: number; type: 'UPDATE_GRID_SIZE' };

function loadFromStorage(): GridState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved) as GridState;
    if (!parsed.boxSize || isNaN(parsed.boxSize)) {
      parsed.boxSize = INITIAL_BOX_SIZE;
    }
    return parsed.version === STORAGE_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

function saveToStorage(state: GridState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function gridReducer(state: GridState, action: GridAction): GridState {
  let newState: GridState;

  switch (action.type) {
    case 'UPDATE_LETTER':
      newState = {
        ...state,
        boxes: state.boxes.map((box) =>
          getId(box) === action.id
            ? { ...box, letter: action.letter.toUpperCase() }
            : box
        ),
      };
      saveToStorage(newState);
      return newState;

    case 'UPDATE_ARROW':
      newState = {
        ...state,
        boxes: state.boxes.map((box) =>
          getId(box) === action.id ? { ...box, arrow: action.arrow } : box
        ),
      };
      saveToStorage(newState);
      return newState;

    case 'UPDATE_BLACK':
      newState = {
        ...state,
        boxes: state.boxes.map((box) =>
          getId(box) === action.id ? { ...box, black: action.black } : box
        ),
      };
      saveToStorage(newState);
      return newState;

    case 'REMOVE_ROW': {
      return {
        ...state,
        boxes: state.boxes.filter((box) => box.row !== action.rowIndex),
        rows: state.rows - 1, // Update rows count
      };
    }

    case 'REMOVE_COLUMN': {
      return {
        ...state,
        boxes: state.boxes.filter((box) => box.col !== action.colIndex),
        cols: state.cols - 1, // Update cols count
      };
    }

    case 'ADD_ROW': {
      const newBoxes = [...state.boxes];
      const currentMaxRow = Math.max(...newBoxes.map((box) => box.row));
      const newRow = action.position === 'top' ? 0 : currentMaxRow + 1;

      for (
        let col = 0;
        col <= Math.max(...newBoxes.map((box) => box.col));
        col++
      ) {
        newBoxes.push({
          row: newRow,
          col,
          letter: null,
        });
      }

      if (action.position === 'top') {
        newBoxes.forEach((box) => {
          if (box.row !== newRow) {
            box.row += 1;
          }
        });
      }

      return {
        ...state,
        boxes: newBoxes,
        rows: state.rows + 1, // Update rows count
      };
    }

    case 'ADD_COLUMN': {
      const newBoxes = [...state.boxes];
      const currentMaxCol = Math.max(...newBoxes.map((box) => box.col));
      const newCol = action.position === 'left' ? 0 : currentMaxCol + 1;

      // Add new boxes for the new column
      for (
        let row = 0;
        row <= Math.max(...newBoxes.map((box) => box.row));
        row++
      ) {
        newBoxes.push({
          row,
          col: newCol,
          letter: null,
        });
      }

      // If adding at left, shift all existing boxes right
      if (action.position === 'left') {
        newBoxes.forEach((box) => {
          if (box.col !== newCol) {
            box.col += 1;
          }
        });
      }

      return {
        ...state,
        boxes: newBoxes,
        cols: state.cols + 1, // Update cols count
      };
    }

    case 'UPDATE_BOX_SIZE':
      newState = {
        ...state,
        boxSize: Math.max(action.size, 4),
      };
      saveToStorage(newState);
      return newState;

    case 'UPDATE_STOP':
      newState = {
        ...state,
        boxes: state.boxes.map((box) =>
          getId(box) === action.id ? { ...box, stop: action.stop } : box
        ),
      };
      saveToStorage(newState);
      return newState;

    case 'SET_HINT':
      newState = {
        ...state,
        boxes: state.boxes.map((box) =>
          getId(box) === action.id ? { ...box, hint: action.hint } : box
        ),
      };
      saveToStorage(newState);
      return newState;

    case 'RESET':
      localStorage.removeItem(STORAGE_KEY);
      newState = getInitialState();
      return newState;

    case 'UPDATE_GRID_SIZE': {
      const updatedBoxes = state.boxes
        .map((box) => ({
          ...box,
          row: Math.min(box.row, action.rows - 1),
          col: Math.min(box.col, action.cols - 1),
        }))
        .filter(
          (box, index, self) =>
            self.findIndex((b) => b.row === box.row && b.col === box.col) ===
            index
        );

      // Add new boxes for expanded areas
      for (let row = 0; row < action.rows; row++) {
        for (let col = 0; col < action.cols; col++) {
          const existingBox = updatedBoxes.find(
            (box) => box.row === row && box.col === col
          );

          if (!existingBox) {
            updatedBoxes.push({
              row,
              col,
              letter: null,
            });
          }
        }
      }

      return {
        ...state,
        rows: action.rows,
        cols: action.cols,
        boxes: updatedBoxes,
      };
    }

    default:
      return state;
  }
}

const getInitialState = (): GridState => {
  console.log('getInitialState');
  const defaultState = {
    version: STORAGE_VERSION,
    boxes: createInitialBoxes(INITIAL_GRID_SIZE.rows, INITIAL_GRID_SIZE.cols),
    boxSize: INITIAL_BOX_SIZE,
    rows: INITIAL_GRID_SIZE.rows,
    cols: INITIAL_GRID_SIZE.cols,
  };

  if (typeof window === 'undefined') {
    return defaultState;
  }

  const saved = loadFromStorage();
  return saved || defaultState;
};

export function useGridReducer() {
  const [state, dispatch] = useReducer(gridReducer, getInitialState());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  function getNextHintNumber(): number {
    const usedHints = state.boxes.map((box) => box.hint);

    console.log('usedHints', usedHints);

    let nextHint = 1;
    while (usedHints.includes(nextHint)) {
      nextHint++;
    }
    return nextHint;
  }

  const updateBoxSize = useCallback((size: number) => {
    dispatch({ type: 'UPDATE_BOX_SIZE', size });
  }, []);

  const updateLetter = useCallback((id: string, letter: string) => {
    dispatch({ type: 'UPDATE_LETTER', id, letter });
  }, []);

  const updateArrow = useCallback((id: string, arrow: Box['arrow']) => {
    dispatch({ type: 'UPDATE_ARROW', id, arrow });
  }, []);

  const updateBlack = useCallback((id: string, black: boolean) => {
    dispatch({ type: 'UPDATE_BLACK', id, black });
  }, []);

  const removeRow = useCallback((rowIndex: number) => {
    dispatch({ type: 'REMOVE_ROW', rowIndex });
  }, []);

  const removeColumn = useCallback((colIndex: number) => {
    dispatch({ type: 'REMOVE_COLUMN', colIndex });
  }, []);

  const addRow = useCallback((position: 'top' | 'bottom') => {
    dispatch({ type: 'ADD_ROW', position });
  }, []);

  const addColumn = useCallback((position: 'left' | 'right') => {
    dispatch({ type: 'ADD_COLUMN', position });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const updateStop = useCallback((id: string, stop: Box['stop']) => {
    dispatch({ type: 'UPDATE_STOP', id, stop });
  }, []);

  const toggleHint = (id: string) => {
    const box = state.boxes.find((box) => getId(box) === id);
    if (box?.hint) {
      // If box already has a hint, remove it
      dispatch({ type: 'SET_HINT', id, hint: undefined });
    } else {
      // If no hint, add the next available number
      const nextHint = getNextHintNumber();
      dispatch({ type: 'SET_HINT', id, hint: nextHint });
    }
  };

  const updateGridSize = useCallback((rows: number, cols: number) => {
    dispatch({ type: 'UPDATE_GRID_SIZE', rows, cols });
  }, []);

  return {
    boxes: state.boxes,
    boxSize: state.boxSize,
    updateBoxSize,
    updateLetter,
    updateArrow,
    updateBlack,
    removeRow,
    removeColumn,
    addRow,
    addColumn,
    reset,
    updateStop,
    toggleHint,
    getNextHintNumber,
    rows: state.rows,
    cols: state.cols,
    updateGridSize,
  };
}
