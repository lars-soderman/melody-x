import { Box } from '@/types';
import { getId } from '@/utils/grid';
import { GridCell } from './GridCell';

type CrosswordGridProps = {
  boxSize: number;
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
  onUpdateArrow: (id: string, direction: 'down' | 'right') => void;
  onUpdateBlack: (id: string, isBlack: boolean) => void;
  onUpdateStop: (id: string, stop: 'bottom' | 'right') => void;
  toggleHint: (id: string) => void;
};

export function CrosswordGrid({
  grid,
  editingBox,
  minCol,
  maxCol,
  onLetterChange,
  onUpdateArrow,
  onUpdateBlack,
  onUpdateStop,
  onNavigate,
  onSetEditingBox,
  boxSize,
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
            boxSize={boxSize}
            editingBox={editingBox}
            toggleHint={toggleHint}
            onLetterChange={onLetterChange}
            onNavigate={onNavigate}
            onSetEditingBox={onSetEditingBox}
            onUpdateArrow={onUpdateArrow}
            onUpdateBlack={onUpdateBlack}
            onUpdateStop={onUpdateStop}
          />
        ))
      )}
    </div>
  );
}
