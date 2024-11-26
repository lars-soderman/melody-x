'use client';

import { DEFAULT_STATE, INITIAL_GRID_SIZE } from '@/constants';
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
  const prevProjectIdRef = useRef<string | null>(project?.id ?? null);
  const prevStateRef = useRef(state);
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

  // Effect for loading from project
  useEffect(() => {
    if (!project) {
      // Reset to default state when project is null
      dispatch({
        type: 'SET_STATE',
        state: {
          boxes: [],
          cols: INITIAL_GRID_SIZE.cols,
          rows: INITIAL_GRID_SIZE.rows,
          font: 'var(--font-default)',
          hints: [],
          version: 1,
        } satisfies GridState,
      });
      return;
    }

    // Set state from project
    dispatch({
      type: 'SET_STATE',
      state: {
        boxes: project.boxes,
        cols: project.cols,
        rows: project.rows,
        font: project.font,
        hints: project.hints,
        version: 1,
      } satisfies GridState,
    });

    prevProjectIdRef.current = project.id;
  }, [project]);

  // Effect for syncing state changes back to project
  useEffect(() => {
    if (!project || project.id !== prevProjectIdRef.current) return;

    const currentStateString = JSON.stringify({
      boxes: state.boxes,
      rows: state.rows,
      cols: state.cols,
      font: state.font,
      hints: state.hints,
    });

    const prevStateString = JSON.stringify({
      boxes: prevStateRef.current.boxes,
      rows: prevStateRef.current.rows,
      cols: prevStateRef.current.cols,
      font: prevStateRef.current.font,
      hints: prevStateRef.current.hints,
    });

    if (currentStateString !== prevStateString) {
      prevStateRef.current = state;

      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      updateTimeoutRef.current = setTimeout(() => {
        onProjectChange({
          ...project,
          boxes: state.boxes,
          rows: state.rows,
          cols: state.cols,
          font: state.font,
          hints: state.hints,
          updatedAt: new Date().toISOString(),
        });
      }, 500);
    }
  }, [state, project, onProjectChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

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
    [state.boxes, getNextHintNumber]
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

  const updateGridSize = useCallback(
    (rows: number, cols: number) => {
      dispatch({ type: 'UPDATE_GRID_SIZE', rows, cols });

      // Update project with new dimensions
      if (project) {
        onProjectChange({
          ...project,
          rows,
          cols,
        });
      }
    },
    [project, onProjectChange]
  );

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

  // const addHint = useCallback(
  //   (boxId: string, direction: 'vertical' | 'horizontal', length: number) => {
  //     const nextNumber = getNextAvailableNumber();
  //     dispatch({
  //       type: 'ADD_HINT',
  //       boxId,
  //       direction,
  //       length,
  //       number: nextNumber,
  //     });
  //     return nextNumber;
  //   },
  //   [getNextAvailableNumber]
  // );

  const updateHintText = useCallback((id: string, text: string) => {
    dispatch({ type: 'UPDATE_HINT_TEXT', id, text });
  }, []);

  // const removeHint = useCallback((id: string) => {
  //   dispatch({ type: 'REMOVE_HINT', id });
  // }, []);

  // const updateHintNumber = useCallback((id: string, number: number) => {
  //   dispatch({ type: 'UPDATE_HINT_NUMBER', id, number });
  // }, []);

  return {
    boxes: state.boxes,
    updateBoxSize,
    updateLetter,
    toggleArrowDown,
    toggleArrowRight,
    toggleBlack,
    removeRow,
    removeColumn,
    addRow,
    addColumn,
    reset,
    toggleStopDown,
    toggleStopRight,
    toggleHint,
    rows: state.rows,
    cols: state.cols,
    updateGridSize,
    font: state.font,
    updateFont,
    hints: state.hints,
    // addHint,
    updateHintText,
    // removeHint,
    // updateHintNumber,
    getNextAvailableNumber,
  };
}
