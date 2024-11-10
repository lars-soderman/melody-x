import { DEFAULT_STATE } from '@/constants';
import { GridState } from '@/types';
import { createInitialBoxes, getId } from '@/utils/grid';
import { GridAction } from './types/gridActions';

export function gridReducer(state: GridState, action: GridAction): GridState {
  let newState: GridState = state;

  try {
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
        const box = state.boxes.find((b) => getId(b) === action.id);
        if (!box) {
          throw new Error(`Box not found: ${action.id}`);
        }
        const arrowUpdate =
          action.arrow === 'down'
            ? { arrowDown: !box.arrowDown }
            : { arrowRight: !box.arrowRight };
        newState = {
          ...state,
          boxes: state.boxes.map((box) =>
            getId(box) === action.id ? { ...box, ...arrowUpdate } : box
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

      case 'REMOVE_ROW': {
        const newBoxes = state.boxes
          .filter((box) => box.row !== action.rowIndex)
          .map((box) => ({
            ...box,
            row: box.row > action.rowIndex ? box.row - 1 : box.row,
          }));

        if (newBoxes.length === state.boxes.length) {
          console.warn(
            'No boxes were removed when removing row:',
            action.rowIndex
          );
        }

        newState = {
          ...state,
          boxes: newBoxes,
          rows: state.rows - 1,
        };
        break;
      }

      case 'REMOVE_COLUMN': {
        const newBoxes = state.boxes
          .filter((box) => box.col !== action.colIndex)
          .map((box) => ({
            ...box,
            col: box.col > action.colIndex ? box.col - 1 : box.col,
          }));

        if (newBoxes.length === state.boxes.length) {
          console.warn(
            'No boxes were removed when removing column:',
            action.colIndex
          );
        }

        newState = {
          ...state,
          boxes: newBoxes,
          cols: state.cols - 1,
        };
        break;
      }

      case 'ADD_ROW': {
        const currentMaxRow = Math.max(...state.boxes.map((box) => box.row));
        const currentMaxCol = Math.max(...state.boxes.map((box) => box.col));

        if (action.position === 'top') {
          // For top insertion, first shift all existing boxes down
          const shiftedBoxes = state.boxes.map((box) => ({
            ...box,
            row: box.row + 1,
          }));

          // Then create new row at position 0
          const newRowBoxes = Array.from(
            { length: currentMaxCol + 1 },
            (_, col) => ({
              row: 0,
              col,
              letter: null,
            })
          );

          newState = {
            ...state,
            boxes: [...newRowBoxes, ...shiftedBoxes],
            rows: state.rows + 1,
          };
        } else {
          // For bottom insertion, simply append new row
          const newRowBoxes = Array.from(
            { length: currentMaxCol + 1 },
            (_, col) => ({
              row: currentMaxRow + 1,
              col,
              letter: null,
            })
          );

          newState = {
            ...state,
            boxes: [...state.boxes, ...newRowBoxes],
            rows: state.rows + 1,
          };
        }
        break;
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

        newState = {
          ...state,
          boxes: newBoxes,
          cols: state.cols + 1,
        };
        break;
      }

      case 'UPDATE_BOX_SIZE':
        newState = {
          ...state,
          boxSize: Math.max(action.size, 4),
        };
        // saveToStorage(newState);
        return newState;

      case 'UPDATE_STOP':
        newState = {
          ...state,
          boxes: state.boxes.map((box) =>
            getId(box) === action.id ? { ...box, stop: action.stop } : box
          ),
        };
        // saveToStorage(newState);
        return newState;

      case 'SET_HINT':
        newState = {
          ...state,
          boxes: state.boxes.map((box) =>
            getId(box) === action.id ? { ...box, hint: action.hint } : box
          ),
        };
        // saveToStorage(newState);
        return newState;

      case 'RESET':
        return {
          ...DEFAULT_STATE,
          boxes: createInitialBoxes(state.rows, state.cols),
          version: 1,
        };

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

        newState = {
          ...state,
          rows: action.rows,
          cols: action.cols,
          boxes: updatedBoxes,
        };
        break;
      }

      case 'UPDATE_FONT':
        newState = {
          ...state,
          font: action.font,
        };
        break;

      case 'SET_STATE':
        return action.state;

      default:
        throw new Error(
          `Unhandled action type: ${(action as { type: string }).type}`
        );
    }

    // Validate the new state
    if (!newState.boxes || !Array.isArray(newState.boxes)) {
      throw new Error('Invalid state: boxes must be an array');
    }
    if (newState.rows < 1 || newState.cols < 1) {
      throw new Error(
        `Invalid dimensions: rows=${newState.rows}, cols=${newState.cols}`
      );
    }

    return newState;
  } catch (error) {
    console.error('Error in grid reducer:', error);
    console.error('Action:', action);
    console.error('Current state:', state);
    return state;
  }
}
