import { Project } from '@/types';

export const mockProject: Project = {
  id: 'test-id',
  name: 'Test Project',
  rows: 9,
  cols: 10,
  boxSize: 64,
  font: 'var(--font-default)',
  createdAt: '2024-03-20T12:00:00Z',
  modifiedAt: '2024-03-20T12:00:00Z',
  boxes: [
    { row: 0, col: 0, letter: 'H' },
    { row: 0, col: 1, letter: 'E' },
    { row: 0, col: 2, letter: 'J', black: true },
    { row: 1, col: 1, letter: 'J', black: true },
    { row: 1, col: 2, letter: 'A', arrowDown: true },
    { row: 1, col: 2, letter: 'A', arrowRight: true },
    { row: 2, col: 3, letter: 'B', stop: 'right' },
    { row: 3, col: 4, letter: 'C', hint: 1 },
  ],
};
