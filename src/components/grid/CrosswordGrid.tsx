import { Box } from '@/types';
import { getId } from '@/utils/grid';
import { GridCell } from './cell/GridCell';

type CrosswordGridProps = {
  boxes: Box[];
  confirmingRemove: { index: number; type: 'row' | 'column' } | null;
  editingBox: Box | null;
  font: string;
  grid: Box[][];
  handleRemoveColumn: (colIndex: number) => void;
  handleRemoveRow: (rowIndex: number) => void;
  maxCol: number;
  maxRow: number;
  minCol: number;
  minRow: number;
  onLetterChange: (id: string, letter: string) => void;
  onNavigate: (box: Box, direction: 'up' | 'down' | 'left' | 'right') => void;
  onSetEditingBox: (box: Box) => void;
  onToggleArrowDown: (id: string) => void;
  onToggleArrowRight: (id: string) => void;
  onToggleBlack: (id: string, isBlack: boolean) => void;
  onToggleStopDown: (id: string) => void;
  onToggleStopRight: (id: string) => void;
  toggleHint: (id: string) => void;
};

export function CrosswordGrid({
  grid,
  editingBox,
  minCol,
  maxCol,
  onLetterChange,
  onToggleArrowDown,
  onToggleArrowRight,
  onToggleBlack,
  onToggleStopDown,
  onToggleStopRight,
  onNavigate,
  onSetEditingBox,
  toggleHint,
  font,
}: CrosswordGridProps) {
  return (
    <div
      className={`grid grid-cols-${maxCol - minCol + 1} border-collapse gap-0 border-2 border-black`}
      id="crossword-grid"
      style={{ fontFamily: font }}
    >
      {grid.map((row) =>
        row.map((box) => (
          <GridCell
            key={getId(box)}
            box={box}
            editingBox={editingBox}
            toggleHint={toggleHint}
            onLetterChange={onLetterChange}
            onNavigate={onNavigate}
            onSetEditingBox={onSetEditingBox}
            onToggleArrowDown={onToggleArrowDown}
            onToggleArrowRight={onToggleArrowRight}
            onToggleBlack={onToggleBlack}
            onToggleStopDown={onToggleStopDown}
            onToggleStopRight={onToggleStopRight}
          />
        ))
      )}
    </div>
  );
}
