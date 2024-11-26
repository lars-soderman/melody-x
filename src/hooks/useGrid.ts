'use client';

import { DEFAULT_STATE } from '@/constants';
import { AppProject, GridState } from '@/types';
import { createInitialBoxes, getId } from '@utils/grid';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { gridReducer } from '../reducers/gridReducer';

const getInitialState = (project: AppProject | null): GridState => {
  if (project) {
    return {
      boxes: project.boxes,
      cols: project.cols,
      rows: project.rows,
      font: project.font,
      hints: project.hints,
      version: 1,
    };
  }
  return {
    ...DEFAULT_STATE,
    boxes: createInitialBoxes(DEFAULT_STATE.rows, DEFAULT_STATE.cols),
    font: DEFAULT_STATE.font,
    hints: [],
    version: 1,
  };
};

export function useGrid(
  project: AppProject | null,
  onProjectChange: (updatedProject: AppProject) => void
) {
  const [state, dispatch] = useReducer(gridReducer, getInitialState(project));
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  const getNextHintNumber = useCallback(() => {
    // Get all currently used hint numbers
    const usedNumbers = state.boxes
      .map((box) => box.hint)
      .filter((hint): hint is number => hint !== undefined)
      .sort((a, b) => a - b);

    // If no hints exist, start with 1
    if (usedNumbers.length === 0) return 1;

    // Find first gap in sequence, or use next number after highest
    let nextNumber = 1;
    for (const num of usedNumbers) {
      if (num > nextNumber) {
        // Found a gap
        return nextNumber;
      }
      nextNumber = num + 1;
    }

    return nextNumber;
  }, [state.boxes]);

  // Single effect for project syncing
  useEffect(() => {
    if (!project) return;

    // Update state when project changes
    dispatch({
      type: 'SET_STATE',
      state: {
        boxes: project.boxes,
        cols: project.cols,
        rows: project.rows,
        font: project.font,
        hints: project.hints,
        version: 1,
      },
    });

    // Cleanup timeout on unmount or project change
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [project]);

  const updateGridSize = useCallback(
    (rows: number, cols: number) => {
      dispatch({ type: 'UPDATE_GRID_SIZE', rows, cols });

      if (project) {
        onProjectChange({
          ...project,
          rows,
          cols,
          boxes: state.boxes.filter((box) => box.row < rows && box.col < cols),
        });
      }
    },
    [project, onProjectChange, state.boxes]
  );

  const toggleHint = useCallback(
    (id: string) => {
      const box = state.boxes.find((box) => getId(box) === id);
      if (!box) return;

      if (box.hint) {
        // If box already has a hint, remove it
        dispatch({ type: 'SET_HINT', id, hint: undefined });
      } else {
        // If box doesn't have a hint, add next available number
        const nextNumber = getNextHintNumber();
        dispatch({ type: 'SET_HINT', id, hint: nextNumber });
      }
    },
    [state.boxes]
  );

  const updateBoxSize = useCallback((size: number) => {
    dispatch({ type: 'UPDATE_BOX_SIZE', size });
  }, []);

  const updateLetter = useCallback((id: string, letter: string) => {
    dispatch({ type: 'UPDATE_LETTER', id, letter });
  }, []);

  const toggleBlack = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_BLACK', id });
  }, []);

  const toggleArrowDown = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_ARROW_DOWN', id });
  }, []);

  const toggleArrowRight = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_ARROW_RIGHT', id });
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

  const toggleStopDown = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_STOP_DOWN', id });
  }, []);

  const toggleStopRight = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_STOP_RIGHT', id });
  }, []);

  const updateFont = (font: string) => dispatch({ type: 'UPDATE_FONT', font });

  const getNextAvailableNumber = useCallback(() => {
    const usedNumbers = state.hints.map((h) => h.number);
    console.log('usedNumbers', usedNumbers);

    let nextNumber = 1;

    while (usedNumbers.includes(nextNumber)) {
      nextNumber++;
    }

    return nextNumber;
  }, [state.hints]);

  const updateHintText = useCallback((id: string, text: string) => {
    dispatch({ type: 'UPDATE_HINT_TEXT', id, text });
  }, []);

  return {
    ...state,
    updateGridSize,
    toggleHint,
    updateBoxSize,
    updateLetter,
    toggleArrowDown,
    toggleArrowRight,
    removeRow,
    removeColumn,
    addRow,
    addColumn,
    reset,
    toggleBlack,
    toggleStopDown,
    toggleStopRight,
    updateFont,
    getNextAvailableNumber,
    updateHintText,
  };
}
