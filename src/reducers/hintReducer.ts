import { Hint, HintState } from '@/types';
import { v4 as uuidv4 } from 'uuid';

type HintAction =
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
  | { state: HintState; type: 'SET_STATE' };

// const initialState: HintState = {
//   hints: [],
//   version: 1,
// };

export function hintReducer(state: HintState, action: HintAction): HintState {
  switch (action.type) {
    case 'ADD_HINT': {
      const newHint: Hint = {
        id: uuidv4(),
        boxId: action.boxId,
        direction: action.direction,
        length: action.length,
        number: action.number,
        text: '',
      };

      return {
        ...state,
        hints: [...state.hints, newHint],
      };
    }

    case 'UPDATE_HINT_TEXT':
      return {
        ...state,
        hints: state.hints.map((hint) =>
          hint.id === action.id ? { ...hint, text: action.text } : hint
        ),
      };

    case 'REMOVE_HINT':
      return {
        ...state,
        hints: state.hints.filter((hint) => hint.id !== action.id),
      };

    case 'UPDATE_HINT_NUMBER':
      return {
        ...state,
        hints: state.hints.map((hint) =>
          hint.id === action.id ? { ...hint, number: action.number } : hint
        ),
      };

    case 'SET_STATE':
      return action.state;

    default:
      return state;
  }
}
