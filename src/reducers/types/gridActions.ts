import { GridState } from '@/types';

export type GridAction =
  | { rowIndex: number; type: 'REMOVE_ROW' }
  | { colIndex: number; type: 'REMOVE_COLUMN' }
  | { position: 'top' | 'bottom'; type: 'ADD_ROW' }
  | { position: 'left' | 'right'; type: 'ADD_COLUMN' }
  | { size: number; type: 'UPDATE_BOX_SIZE' }
  | { cols: number; rows: number; type: 'UPDATE_GRID_SIZE' }
  | { id: string; letter: string; type: 'UPDATE_LETTER' }
  | { id: string; type: 'TOGGLE_BLACK' }
  | { id: string; type: 'TOGGLE_ARROW_DOWN' }
  | { id: string; type: 'TOGGLE_ARROW_RIGHT' }
  | { id: string; type: 'TOGGLE_STOP_DOWN' }
  | { id: string; type: 'TOGGLE_STOP_RIGHT' }
  | { font: string; type: 'UPDATE_FONT' }
  | { type: 'RESET' }
  | { state: GridState; type: 'SET_STATE' }
  | {
      boxId: string;
      direction: 'vertical' | 'horizontal';
      length: number;
      number: number;
      type: 'ADD_HINT';
    }
  | { id: string; text: string; type: 'UPDATE_HINT_TEXT' }
  | { id: string; type: 'REMOVE_HINT' }
  | { id: string; number: number; type: 'UPDATE_HINT_NUMBER' }
  | { hint?: number; id: string; type: 'SET_HINT' };
