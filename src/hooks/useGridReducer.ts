'use client';

import { INITIAL_GRID_SIZE } from '@/constants';
import { Box } from '@types';
import { createInitialBoxes, getId } from '@utils/grid';
import { useReducer } from 'react';

const STORAGE_KEY = 'melodikryss-state';
const STORAGE_VERSION = 1;

type GridState = {
  version: number;
  boxes: Box[];
  boxSize: number;
};

type GridAction =
  | { type: 'UPDATE_LETTER'; id: string; letter: string }
  | { type: 'UPDATE_ARROW'; id: string; arrow: Box['arrow'] }
  | { type: 'UPDATE_BLACK'; id: string; black: boolean }
  | { type: 'REMOVE_ROW'; rowIndex: number }
  | { type: 'REMOVE_COLUMN'; colIndex: number }
  | { type: 'ADD_ROW'; position: 'top' | 'bottom' }
  | { type: 'ADD_COLUMN'; position: 'left' | 'right' }
  | { type: 'UPDATE_BOX_SIZE'; size: number }
  | { type: 'RESET' };

function loadFromStorage(): GridState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved) as GridState;
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
      break;

    case 'UPDATE_ARROW':
      newState = {
        ...state,
        boxes: state.boxes.map((box) =>
          getId(box) === action.id ? { ...box, arrow: action.arrow } : box
        ),
      };
      break;

    case 'UPDATE_BLACK':
      newState = {
        ...state,
        boxes: state.boxes.map((box) =>
          getId(box) === action.id ? { ...box, black: action.black } : box
        ),
      };
      break;

    case 'REMOVE_ROW':
      const filtered = state.boxes.filter((box) => box.row !== action.rowIndex);
      newState = {
        ...state,
        boxes: filtered.map((box) => ({
          ...box,
          row: box.row > action.rowIndex ? box.row - 1 : box.row,
        })),
      };
      break;

    case 'REMOVE_COLUMN':
      const filteredCols = state.boxes.filter(
        (box) => box.col !== action.colIndex
      );
      newState = {
        ...state,
        boxes: filteredCols.map((box) => ({
          ...box,
          col: box.col > action.colIndex ? box.col - 1 : box.col,
        })),
      };
      break;

    case 'ADD_ROW': {
      const minRow = Math.min(...state.boxes.map((box) => box.row));
      const maxRow = Math.max(...state.boxes.map((box) => box.row));
      const minCol = Math.min(...state.boxes.map((box) => box.col));
      const maxCol = Math.max(...state.boxes.map((box) => box.col));

      let shiftedBoxes = state.boxes;
      if (action.position === 'top') {
        shiftedBoxes = state.boxes.map((box) => ({ ...box, row: box.row + 1 }));
      }

      const newRowIndex = action.position === 'top' ? minRow : maxRow + 1;
      const newRow = Array.from(
        { length: maxCol - minCol + 1 },
        (_, colIndex) => ({
          letter: null,
          row: newRowIndex,
          col: colIndex + minCol,
        })
      );

      newState = {
        ...state,
        boxes: [...shiftedBoxes, ...newRow],
      };
      break;
    }

    case 'RESET':
      newState = {
        version: STORAGE_VERSION,
        boxes: createInitialBoxes(
          INITIAL_GRID_SIZE.rows,
          INITIAL_GRID_SIZE.cols
        ),
        boxSize: 64,
      };
      break;

    case 'ADD_COLUMN': {
      const minRow = Math.min(...state.boxes.map((box) => box.row));
      const maxRow = Math.max(...state.boxes.map((box) => box.row));
      const minCol = Math.min(...state.boxes.map((box) => box.col));
      const maxCol = Math.max(...state.boxes.map((box) => box.col));

      let shiftedBoxes = state.boxes;
      if (action.position === 'left') {
        shiftedBoxes = state.boxes.map((box) => ({ ...box, col: box.col + 1 }));
      }

      const newColIndex = action.position === 'left' ? minCol : maxCol + 1;
      const newCol = Array.from(
        { length: maxRow - minRow + 1 },
        (_, rowIndex) => ({
          letter: null,
          row: rowIndex + minRow,
          col: newColIndex,
        })
      );

      newState = {
        ...state,
        boxes: [...shiftedBoxes, ...newCol],
      };
      break;
    }

    case 'UPDATE_BOX_SIZE': {
      newState = {
        ...state,
        boxSize: Math.max(32, Math.min(96, action.size)),
      };
      break;
    }

    default:
      return state;
  }

  // Automatically save to storage after each action
  saveToStorage(newState);
  return newState;
}

// Get initial state safely (works on client-side only)
const getInitialState = (): GridState => {
  if (typeof window !== 'undefined') {
    const saved = loadFromStorage();
    if (saved) return saved;
  }
  return {
    version: STORAGE_VERSION,
    boxes: createInitialBoxes(INITIAL_GRID_SIZE.rows, INITIAL_GRID_SIZE.cols),
    boxSize: 64,
  };
};

export function useGridReducer() {
  const [state, dispatch] = useReducer(gridReducer, getInitialState());

  // Save to localStorage on each state change
  if (typeof window !== 'undefined' && state.boxes.length > 0) {
    localStorage.setItem('boxes', JSON.stringify(state.boxes));
  }

  return {
    boxes: state.boxes,
    boxSize: state.boxSize,
    updateBoxSize: (size: number) =>
      dispatch({ type: 'UPDATE_BOX_SIZE', size }),
    updateLetter: (id: string, letter: string) =>
      dispatch({ type: 'UPDATE_LETTER', id, letter }),
    updateArrow: (id: string, arrow: Box['arrow']) =>
      dispatch({ type: 'UPDATE_ARROW', id, arrow }),
    updateBlack: (id: string, black: boolean) =>
      dispatch({ type: 'UPDATE_BLACK', id, black }),
    removeRow: (rowIndex: number) => dispatch({ type: 'REMOVE_ROW', rowIndex }),
    removeColumn: (colIndex: number) =>
      dispatch({ type: 'REMOVE_COLUMN', colIndex }),
    addRow: (position: 'top' | 'bottom') =>
      dispatch({ type: 'ADD_ROW', position }),
    reset: () => dispatch({ type: 'RESET' }),
    addColumn: (position: 'left' | 'right') =>
      dispatch({ type: 'ADD_COLUMN', position }),
  };
}
