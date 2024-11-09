import { DEFAULT_STATE } from '@/constants';
import { gridReducer } from '@/reducers/gridReducer';

describe('gridReducer', () => {
  const initialState = {
    ...DEFAULT_STATE,
    version: 1,
    boxes: [
      { row: 0, col: 0, letter: 'A' },
      { row: 0, col: 1, letter: 'B' },
      { row: 1, col: 0, letter: 'C' },
      { row: 1, col: 1, letter: 'D' },
    ],
    createdAt: new Date().toISOString(),
    id: 'test-id',
    modifiedAt: new Date().toISOString(),
    name: 'Test Project',
  };

  it('should update letter', () => {
    const action = {
      type: 'UPDATE_LETTER' as const,
      id: '0-0',
      letter: 'X',
    };

    const newState = gridReducer(initialState, action);
    const updatedBox = newState.boxes.find((b) => b.row === 0 && b.col === 0);
    expect(updatedBox?.letter).toBe('X');
  });

  it('should remove row', () => {
    const action = {
      type: 'REMOVE_ROW' as const,
      rowIndex: 0,
    };

    const newState = gridReducer(initialState, action);
    expect(newState.rows).toBe(initialState.rows - 1);
    expect(newState.boxes.length).toBe(2);
    expect(newState.boxes.every((b) => b.row === 0)).toBe(true);
  });

  it('should add row at top', () => {
    const action = {
      type: 'ADD_ROW' as const,
      position: 'top' as const,
    };

    const newState = gridReducer(initialState, action);
    expect(newState.rows).toBe(initialState.rows + 1);

    // Original boxes should be shifted down
    const originalA = newState.boxes.find((b) => b.letter === 'A');
    expect(originalA?.row).toBe(1);
  });

  it('should update black state', () => {
    const action = {
      type: 'UPDATE_BLACK' as const,
      id: '0-0',
      black: true,
    };

    const newState = gridReducer(initialState, action);
    const updatedBox = newState.boxes.find((b) => b.row === 0 && b.col === 0);
    expect(updatedBox?.black).toBe(true);
  });

  it('should handle grid size updates', () => {
    const action = {
      type: 'UPDATE_GRID_SIZE' as const,
      rows: 5,
      cols: 6,
    };

    const newState = gridReducer(initialState, action);
    expect(newState.rows).toBe(5);
    expect(newState.cols).toBe(6);
    expect(newState.boxes.length).toBe(30); // 5 * 6
  });

  it('should reset to initial state', () => {
    const action = { type: 'RESET' as const };
    const newState = gridReducer(initialState, action);

    expect(newState.rows).toBe(DEFAULT_STATE.rows);
    expect(newState.cols).toBe(DEFAULT_STATE.cols);
    expect(newState.boxes.length).toBe(DEFAULT_STATE.rows * DEFAULT_STATE.cols);
  });
});
