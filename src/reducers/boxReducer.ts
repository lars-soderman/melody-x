// import { Box } from '@/types';
// import { getId } from '@/utils/grid';

// export type BoxAction =
//   | { id: string; letter: string; type: 'UPDATE_LETTER' }
//   | { id: string; type: 'TOGGLE_ARROW_DOWN' }
//   | { id: string; type: 'TOGGLE_ARROW_RIGHT' }
//   | { id: string; type: 'TOGGLE_BLACK' }
//   | { id: string; type: 'TOGGLE_STOP_DOWN' }
//   | { id: string; type: 'TOGGLE_STOP_RIGHT' }
//   | { hint?: number; id: string; type: 'SET_HINT' };

// export function boxReducer(boxes: Box[], action: BoxAction): Box[] {
//   switch (action.type) {
//     case 'UPDATE_LETTER':
//       return boxes.map((box) =>
//         getId(box) === action.id
//           ? { ...box, letter: action.letter.toUpperCase() }
//           : box
//       );

//     case 'TOGGLE_ARROW_DOWN':
//       return boxes.map((box) =>
//         getId(box) === action.id ? { ...box, arrowDown: !box.arrowDown } : box
//       );

//     case 'TOGGLE_ARROW_RIGHT':
//       return boxes.map((box) =>
//         getId(box) === action.id ? { ...box, arrowRight: !box.arrowRight } : box
//       );

//     case 'TOGGLE_BLACK':
//       return boxes.map((box) =>
//         getId(box) === action.id ? { ...box, black: !box.black } : box
//       );

//     case 'TOGGLE_STOP_DOWN':
//       return boxes.map((box) =>
//         getId(box) === action.id ? { ...box, stopDown: !box.stopDown } : box
//       );

//     case 'TOGGLE_STOP_RIGHT':
//       return boxes.map((box) =>
//         getId(box) === action.id ? { ...box, stopRight: !box.stopRight } : box
//       );

//     case 'SET_HINT':
//       console.log('togglehint');

//       return boxes.map((box) =>
//         getId(box) === action.id ? { ...box, hint: action.hint } : box
//       );

//     default:
//       return boxes;
//   }
// }
