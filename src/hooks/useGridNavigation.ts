import { Box } from '@/types';
import { useState } from 'react';

export function useGridNavigation(boxes: Box[]) {
  const [editingBox, setEditingBox] = useState<Box | null>(null);

  const handleNavigate = (
    currentBox: Box,
    direction: 'up' | 'down' | 'left' | 'right'
  ) => {
    const nextPosition = {
      row:
        currentBox.row +
        (direction === 'up' ? -1 : direction === 'down' ? 1 : 0),
      col:
        currentBox.col +
        (direction === 'left' ? -1 : direction === 'right' ? 1 : 0),
    };

    // Find the next box at the calculated position
    const nextBox = boxes.find(
      (box) => box.row === nextPosition.row && box.col === nextPosition.col
    );

    if (!nextBox) {
      // Hit bottom edge - try moving right
      if (direction === 'down') {
        const rightBox = boxes.find(
          (box) => box.row === currentBox.row && box.col === currentBox.col + 1
        );
        if (rightBox) {
          setEditingBox(rightBox);
        }
      }
      // Hit right edge - try moving down
      else if (direction === 'right') {
        const downBox = boxes.find(
          (box) => box.col === currentBox.col && box.row === currentBox.row + 1
        );
        if (downBox) {
          setEditingBox(downBox);
        }
      }
    } else {
      setEditingBox(nextBox);
    }
  };

  return {
    editingBox,
    setEditingBox,
    handleNavigate,
  };
}
