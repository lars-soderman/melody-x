import { Box } from '@/types';
import { getId } from '@/utils/grid';
import { GridCell } from './GridCell';
import { RemoveButtons } from './RemoveButtons';

type CrosswordGridProps = {
  grid: Box[][];
  editingBox: Box | null;
  boxes: Box[];
  minRow: number;
  minCol: number;
  maxRow: number;
  maxCol: number;
  onLetterChange: (id: string, letter: string) => void;
  onUpdateArrow: (id: string, direction: 'down' | 'right') => void;
  onUpdateBlack: (id: string, isBlack: boolean) => void;
  onNavigate: (box: Box, direction: 'up' | 'down' | 'left' | 'right') => void;
  onSetEditingBox: (box: Box) => void;
  handleRemoveRow: (rowIndex: number) => void;
  handleRemoveColumn: (colIndex: number) => void;
  confirmingRemove: { type: 'row' | 'column'; index: number } | null;
};

export function CrosswordGrid({
  grid,
  editingBox,
  boxes,
  minRow,
  minCol,
  maxRow,
  maxCol,
  onLetterChange,
  onUpdateArrow,
  onUpdateBlack,
  onNavigate,
  onSetEditingBox,
  handleRemoveRow,
  handleRemoveColumn,
  confirmingRemove,
}: CrosswordGridProps) {
  return (
    <div
      className={`grid w-full grid-cols-${maxCol - minCol + 1} border-collapse gap-0 border-2 border-black`}
    >
      {grid.map((row) =>
        row.map((box) => (
          <GridCell
            key={getId(box)}
            box={box}
            editingBox={editingBox}
            onLetterChange={onLetterChange}
            onUpdateArrow={onUpdateArrow}
            onUpdateBlack={onUpdateBlack}
            onNavigate={onNavigate}
            onSetEditingBox={onSetEditingBox}
          />
        ))
      )}
      <RemoveButtons
        grid={grid}
        minRow={minRow}
        minCol={minCol}
        maxRow={maxRow}
        maxCol={maxCol}
        handleRemoveRow={handleRemoveRow}
        handleRemoveColumn={handleRemoveColumn}
        confirmingRemove={confirmingRemove}
      />
    </div>
  );
}
