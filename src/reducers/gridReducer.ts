import { INITIAL_GRID_SIZE } from '@/constants';
import { GridState } from '@/types';
import { createInitialBoxes, getId } from '@/utils/grid';
import { GridAction } from './types/gridActions';

export function gridReducer(state: GridState, action: GridAction): GridState {
  switch (action.type) {
    case 'REMOVE_ROW':
      return {
        ...state,
        boxes: state.boxes
          .filter((box) => box.row !== action.rowIndex)
          .map((box) =>
            box.row > action.rowIndex ? { ...box, row: box.row - 1 } : box
          ),
        rows: state.rows - 1,
        version: state.version + 1,
      };

    case 'REMOVE_COLUMN':
      return {
        ...state,
        boxes: state.boxes
          .filter((box) => box.col !== action.colIndex)
          .map((box) =>
            box.col > action.colIndex ? { ...box, col: box.col - 1 } : box
          ),
        cols: state.cols - 1,
        version: state.version + 1,
      };

    case 'ADD_ROW':
      return {
        ...state,
        boxes:
          action.position === 'top'
            ? state.boxes.map((box) => ({ ...box, row: box.row + 1 }))
            : state.boxes,
        rows: state.rows + 1,
        version: state.version + 1,
      };

    case 'ADD_COLUMN':
      return {
        ...state,
        boxes:
          action.position === 'left'
            ? state.boxes.map((box) => ({ ...box, col: box.col + 1 }))
            : state.boxes,
        cols: state.cols + 1,
        version: state.version + 1,
      };

    case 'UPDATE_GRID_SIZE': {
      // Create array for all possible positions in new grid
      const newBoxes = Array.from({ length: action.rows }, (_, row) =>
        Array.from({ length: action.cols }, (_, col) => {
          // Try to find existing box at this position
          const existingBox = state.boxes.find(
            (box) => box.row === row && box.col === col
          );

          // Return existing box or create new empty one
          return (
            existingBox || {
              row,
              col,
              letter: null,
            }
          );
        })
      ).flat();

      return {
        ...state,
        boxes: newBoxes,
        rows: action.rows,
        cols: action.cols,
        version: state.version + 1,
      };
    }

    case 'UPDATE_FONT':
      return {
        ...state,
        font: action.font,
        version: state.version + 1,
      };

    case 'RESET':
      return {
        ...state,
        boxes: createInitialBoxes(
          INITIAL_GRID_SIZE.rows,
          INITIAL_GRID_SIZE.cols
        ),
        cols: INITIAL_GRID_SIZE.cols,
        rows: INITIAL_GRID_SIZE.rows,
        font: 'var(--font-default)',
        hints: [],
        version: state.version + 1,
      };

    case 'ADD_HINT': {
      return {
        ...state,
        hints: [
          ...state.hints,
          {
            id: action.boxId,
            boxId: action.boxId,
            direction: action.direction,
            length: action.length,
            number: action.number,
            text: '',
          },
        ],
        boxes: state.boxes.map((box) =>
          getId(box) === action.boxId ? { ...box, hint: action.number } : box
        ),
      };
    }

    case 'REMOVE_HINT':
      return {
        ...state,
        hints: state.hints.filter((hint) => hint.id !== action.id),
      };

    case 'UPDATE_HINT_TEXT':
      return {
        ...state,
        hints: state.hints.map((hint) =>
          hint.id === action.id ? { ...hint, text: action.text } : hint
        ),
      };

    case 'REMOVE_HINT':
      return {
        ...state,
        hints: state.hints.filter((hint) => hint.id !== action.id),
      };

    case 'UPDATE_HINT_NUMBER':
      return {
        ...state,
        hints: state.hints.map((hint) =>
          hint.id === action.id ? { ...hint, number: action.number } : hint
        ),
      };

    case 'UPDATE_LETTER':
      return {
        ...state,
        boxes: state.boxes.map((box) =>
          getId(box) === action.id ? { ...box, letter: action.letter } : box
        ),
      };

    case 'TOGGLE_ARROW_DOWN':
      return {
        ...state,
        boxes: state.boxes.map((box) =>
          getId(box) === action.id ? { ...box, arrowDown: !box.arrowDown } : box
        ),
      };

    case 'TOGGLE_ARROW_RIGHT':
      return {
        ...state,
        boxes: state.boxes.map((box) =>
          getId(box) === action.id
            ? { ...box, arrowRight: !box.arrowRight }
            : box
        ),
      };

    case 'TOGGLE_BLACK':
      return {
        ...state,
        boxes: state.boxes.map((box) =>
          getId(box) === action.id ? { ...box, black: !box.black } : box
        ),
      };

    case 'TOGGLE_STOP_DOWN':
      return {
        ...state,
        boxes: state.boxes.map((box) =>
          getId(box) === action.id ? { ...box, stopDown: !box.stopDown } : box
        ),
      };

    case 'TOGGLE_STOP_RIGHT':
      return {
        ...state,
        boxes: state.boxes.map((box) =>
          getId(box) === action.id ? { ...box, stopRight: !box.stopRight } : box
        ),
      };

    case 'SET_HINT':
      return {
        ...state,
        boxes: state.boxes.map((box) =>
          getId(box) === action.id ? { ...box, hint: action.hint } : box
        ),
      };

    case 'SET_STATE': {
      return action.state;
    }

    default:
      return state;
  }
}
