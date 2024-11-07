import { Box, Project } from '@/types';
import { createInitialBoxes } from '@/utils/grid';

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

export function createDefaultProject(name: string): Project {
  return {
    id: `new-${Date.now()}`,
    name,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    ...DEFAULT_STATE,
    boxes: createInitialBoxes(DEFAULT_STATE.rows, DEFAULT_STATE.cols),
  };
}
