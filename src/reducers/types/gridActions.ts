import { Box, GridState } from '@/types';

export type GridAction =
  | { id: string; letter: string; type: 'UPDATE_LETTER' }
  | { arrowDown: Box['arrowDown']; id: string; type: 'UPDATE_ARROW_DOWN' }
  | { arrowRight: Box['arrowRight']; id: string; type: 'UPDATE_ARROW_RIGHT' }
  | { black: boolean; id: string; type: 'UPDATE_BLACK' }
  | { rowIndex: number; type: 'REMOVE_ROW' }
  | { colIndex: number; type: 'REMOVE_COLUMN' }
  | { position: 'top' | 'bottom'; type: 'ADD_ROW' }
  | { position: 'left' | 'right'; type: 'ADD_COLUMN' }
  | { size: number; type: 'UPDATE_BOX_SIZE' }
  | { type: 'RESET' }
  | { id: string; stop: Box['stopDown']; type: 'UPDATE_STOP_DOWN' }
  | { id: string; stop: Box['stopRight']; type: 'UPDATE_STOP_RIGHT' }
  | { hint?: number; id: string; type: 'SET_HINT' }
  | { cols: number; rows: number; type: 'UPDATE_GRID_SIZE' }
  | { font: string; type: 'UPDATE_FONT' }
  | { state: GridState; type: 'SET_STATE' };
