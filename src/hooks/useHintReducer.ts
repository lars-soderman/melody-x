import { hintReducer } from '@/reducers/hintReducer';
import { Hint } from '@/types';
import { useCallback, useEffect, useReducer, useRef } from 'react';

export function useHintReducer(
  initialHints: Hint[] = [],
  onHintsChange?: (hints: Hint[]) => void
) {
  const [state, dispatch] = useReducer(hintReducer, {
    hints: initialHints,
    version: 1,
  });

  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (onHintsChange) {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      if (state.hints !== initialHints) {
        updateTimeoutRef.current = setTimeout(() => {
          onHintsChange(state.hints);
        }, 1000);
      }
    }

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [state.hints, onHintsChange, initialHints]);

  const getNextAvailableNumber = useCallback(() => {
    const usedNumbers = state.hints.map((h) => h.number);
    let nextNumber = 1;

    while (usedNumbers.includes(nextNumber)) {
      nextNumber++;
    }

    return nextNumber;
  }, [state.hints]);

  const addHint = useCallback(
    (boxId: string, direction: 'vertical' | 'horizontal', length: number) => {
      const nextNumber = getNextAvailableNumber();
      dispatch({
        type: 'ADD_HINT',
        boxId,
        direction,
        length,
        number: nextNumber,
      });
      return nextNumber;
    },
    [getNextAvailableNumber]
  );

  const updateHintText = useCallback((id: string, text: string) => {
    dispatch({ type: 'UPDATE_HINT_TEXT', id, text });
  }, []);

  const removeHint = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_HINT', id });
  }, []);

  const updateHintNumber = useCallback((id: string, number: number) => {
    dispatch({ type: 'UPDATE_HINT_NUMBER', id, number });
  }, []);

  return {
    hints: state.hints,
    addHint,
    updateHintText,
    removeHint,
    updateHintNumber,
    getNextAvailableNumber,
  };
}
