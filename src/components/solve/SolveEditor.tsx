'use client';

import { useGridNavigation } from '@/hooks/useGridNavigation';
import { AppProject } from '@/types';
import {
  getId,
  getMaxCol,
  getMaxRow,
  getMinCol,
  getMinRow,
  toGrid,
} from '@/utils/grid';
import { useState } from 'react';
import { CrosswordGrid } from '../grid/CrosswordGrid';

type SolveEditorProps = {
  project: AppProject;
};

export function SolveEditor({ project }: SolveEditorProps) {
  const [boxes, setBoxes] = useState(project.boxes);
  const {
    editingBox,
    setEditingBox,
    handleKeyboardNavigation,
    handleCharacterInput,
  } = useGridNavigation(boxes);

  const handleLetterChange = (id: string, letter: string) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) => (getId(box) === id ? { ...box, letter } : box))
    );
    if (editingBox) {
      handleCharacterInput(editingBox);
    }
  };

  const minRow = getMinRow(boxes);
  const maxRow = getMaxRow(boxes);
  const minCol = getMinCol(boxes);
  const maxCol = getMaxCol(boxes);
  const grid = toGrid(boxes, minRow, maxRow, minCol, maxCol);

  return (
    <CrosswordGrid
      boxes={boxes}
      editingBox={editingBox}
      font={project.font}
      grid={grid}
      maxCol={maxCol}
      maxRow={maxRow}
      minCol={minCol}
      minRow={minRow}
      showOptions={false}
      onLetterChange={handleLetterChange}
      onNavigate={handleKeyboardNavigation}
      onSetEditingBox={setEditingBox}
    />
  );
}
