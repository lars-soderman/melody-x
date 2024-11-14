import { Box, Project } from '@/types';
import { createInitialBoxes } from '@/utils/grid';
import { v4 as uuidv4 } from 'uuid';

export const INITIAL_GRID_SIZE = {
  rows: 9,
  cols: 10,
};
export const INITIAL_BOX_SIZE = 64;

export const DEFAULT_STATE = {
  boxes: [] as Box[],
  boxSize: INITIAL_BOX_SIZE,
  rows: INITIAL_GRID_SIZE.rows,
  cols: INITIAL_GRID_SIZE.cols,
  font: 'var(--font-default)',
} as const;

export function createDefaultProject(name: string, userId: string): Project {
  return {
    id: uuidv4(),
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...DEFAULT_STATE,
    boxes: createInitialBoxes(DEFAULT_STATE.rows, DEFAULT_STATE.cols),
    createdBy: userId,
    hints: [],
  };
}
