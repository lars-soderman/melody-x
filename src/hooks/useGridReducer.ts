'use client';

import { DEFAULT_STATE } from '@/constants';
import { Box, GridState, Project } from '@/types';
import { createInitialBoxes, getId } from '@utils/grid';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { gridReducer } from '../reducers/gridReducer';

const getInitialState = (project: Project | null): GridState => {
  if (project) {
    return {
      boxSize: project.boxSize,
      boxes: project.boxes,
      cols: project.cols,
      rows: project.rows,
      font: project.font,
      version: 1,
    };
  }
  return {
    ...DEFAULT_STATE,
    boxes: createInitialBoxes(DEFAULT_STATE.rows, DEFAULT_STATE.cols),
    font: DEFAULT_STATE.font,
    version: 1,
  };
};

export function useGridReducer(
  project: Project | null,
  onProjectChange: (updatedProject: Project) => void,
  getNextHintNumber: () => number
) {
  const [state, dispatch] = useReducer(gridReducer, getInitialState(project));
  const prevProjectIdRef = useRef<string | null>(project?.id ?? null);
  const prevStateRef = useRef(state);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  // Effect for loading from project
  useEffect(() => {
    if (!project) return;

    // Reset state when switching to a different project
    if (project.id !== prevProjectIdRef.current) {
      prevProjectIdRef.current = project.id;
      dispatch({
        type: 'SET_STATE',
        state: {
          boxSize: project.boxSize,
          boxes: project.boxes,
          cols: project.cols,
          rows: project.rows,
          font: project.font,
          version: 1,
        },
      });
    }
  }, [project]);

  // Effect for syncing state changes back to project
  useEffect(() => {
    if (!project || project.id !== prevProjectIdRef.current) return;

    const currentStateString = JSON.stringify({
      boxes: state.boxes,
      boxSize: state.boxSize,
      rows: state.rows,
      cols: state.cols,
      font: state.font,
    });

    const prevStateString = JSON.stringify({
      boxes: prevStateRef.current.boxes,
      boxSize: prevStateRef.current.boxSize,
      rows: prevStateRef.current.rows,
      cols: prevStateRef.current.cols,
      font: prevStateRef.current.font,
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
          boxSize: state.boxSize,
          rows: state.rows,
          cols: state.cols,
          font: state.font,
          modifiedAt: new Date().toISOString(),
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
        // Use the provided hint number function
        const nextHint = getNextHintNumber();
        dispatch({ type: 'SET_HINT', id, hint: nextHint });
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

  const updateArrowDown = useCallback(
    (id: string) => {
      dispatch({
        type: 'UPDATE_ARROW_DOWN',
        id,
        arrowDown: !state.boxes.find((box) => getId(box) === id)?.arrowDown,
      });
    },
    [state.boxes]
  );

  const updateArrowRight = useCallback(
    (id: string) => {
      dispatch({
        type: 'UPDATE_ARROW_RIGHT',
        id,
        arrowRight: !state.boxes.find((box) => getId(box) === id)?.arrowRight,
      });
    },
    [state.boxes]
  );

  const updateBlack = useCallback((id: string, black: boolean) => {
    dispatch({ type: 'UPDATE_BLACK', id, black });
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

  const updateStop = useCallback((id: string, stop: Box['stop']) => {
    dispatch({ type: 'UPDATE_STOP', id, stop });
  }, []);

  const updateGridSize = useCallback((rows: number, cols: number) => {
    dispatch({ type: 'UPDATE_GRID_SIZE', rows, cols });
  }, []);

  const setHint = useCallback((id: string, hint: number | undefined) => {
    dispatch({ type: 'SET_HINT', id, hint });
  }, []);

  const updateFont = (font: string) => dispatch({ type: 'UPDATE_FONT', font });

  return {
    boxes: state.boxes,
    boxSize: state.boxSize,
    updateBoxSize,
    updateLetter,
    updateArrowDown,
    updateArrowRight,
    updateBlack,
    removeRow,
    removeColumn,
    addRow,
    addColumn,
    reset,
    updateStop,
    toggleHint,
    rows: state.rows,
    cols: state.cols,
    updateGridSize,
    font: state.font,
    updateFont,
    setHint,
  };
}
