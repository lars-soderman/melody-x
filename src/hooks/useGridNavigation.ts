import { Box } from '@/types';
import { useState } from 'react';

type Direction = 'down' | 'right';
type NavigationDirection = 'up' | 'down' | 'left' | 'right';

export function useGridNavigation(boxes: Box[]) {
  const [editingBox, setEditingBox] = useState<Box | null>(null);
  const [currentDirection, setCurrentDirection] = useState<Direction>('right');

  const handleKeyboardNavigation = (
    currentBox: Box,
    direction: NavigationDirection
  ) => {
    const nextPosition = {
      row:
        currentBox.row +
        (direction === 'up' ? -1 : direction === 'down' ? 1 : 0),
      col:
        currentBox.col +
        (direction === 'left' ? -1 : direction === 'right' ? 1 : 0),
    };

    const nextBox = boxes.find(
      (box) => box.row === nextPosition.row && box.col === nextPosition.col
    );

    if (nextBox) {
      setEditingBox(nextBox);
      if (direction === 'down' || direction === 'right') {
        setCurrentDirection(direction);
      }
    }
  };

  const handleCharacterInput = (currentBox: Box) => {
    const nextPosition = {
      row: currentBox.row + (currentDirection === 'down' ? 1 : 0),
      col: currentBox.col + (currentDirection === 'right' ? 1 : 0),
    };

    const nextBox = boxes.find(
      (box) => box.row === nextPosition.row && box.col === nextPosition.col
    );

    if (nextBox) {
      setEditingBox(nextBox);
    } else {
      // At edge - try alternate direction
      if (currentDirection === 'right') {
        const downBox = boxes.find(
          (box) => box.col === currentBox.col && box.row === currentBox.row + 1
        );
        if (downBox) {
          setEditingBox(downBox);
          setCurrentDirection('down');
        }
      } else {
        const rightBox = boxes.find(
          (box) => box.row === currentBox.row && box.col === currentBox.col + 1
        );
        if (rightBox) {
          setEditingBox(rightBox);
          setCurrentDirection('right');
        }
      }
    }
  };

  return {
    editingBox,
    setEditingBox,
    handleKeyboardNavigation,
    handleCharacterInput,
    currentDirection,
  };
}
