import { Box } from '@/types';
import { getId } from '@/utils/grid';
import { GridCell } from './cell/GridCell';

export type GridOptionHandlers = {
  onToggleArrowDown: (id: string) => void;
  onToggleArrowRight: (id: string) => void;
  onToggleBlack: (id: string) => void;
  onToggleHint: (id: string) => void;
  onToggleHyphenBottom: (id: string) => void;
  onToggleHyphenRight: (id: string) => void;
  onToggleStopDown: (id: string) => void;
  onToggleStopRight: (id: string) => void;
};

type CrosswordGridProps = {
  boxes: Box[];
  confirmingRemove?: { index: number; type: 'row' | 'column' } | null;
  editingBox: Box | null;
  font: string;
  grid: Box[][];
  handleRemoveColumn?: (colIndex: number) => void;
  handleRemoveRow?: (rowIndex: number) => void;
  maxCol: number;
  maxRow: number;
  minCol: number;
  minRow: number;
  onLetterChange: (id: string, letter: string) => void;
  onNavigate: (box: Box, direction: 'up' | 'down' | 'left' | 'right') => void;
  onSetEditingBox: (box: Box) => void;
  optionHandlers?: GridOptionHandlers;
  showOptions?: boolean;
};

export function CrosswordGrid({
  editingBox,
  font,
  grid,
  maxCol,
  minCol,
  onLetterChange,
  onNavigate,
  onSetEditingBox,
  optionHandlers,
  showOptions = true,
}: CrosswordGridProps) {
  const {
    onToggleArrowDown,
    onToggleArrowRight,
    onToggleBlack,
    onToggleHyphenBottom,
    onToggleHyphenRight,
    onToggleStopDown,
    onToggleStopRight,
    onToggleHint,
  } = optionHandlers ?? {};
  const cols = maxCol - minCol + 1;
  const rows = grid.length;

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-fit">
        <div
          className="grid border-collapse gap-0 border-2 border-black"
          id="crossword-grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(24px, 64px))`,
            width: `clamp(${cols * 24}px, 100%, ${cols * 64}px)`,
            aspectRatio: `${cols} / ${rows}`,
            fontFamily: font,
          }}
        >
          {grid.map((row) =>
            row.map((box) => (
              <GridCell
                key={getId(box)}
                box={box}
                editingBox={editingBox}
                showOptions={showOptions}
                onLetterChange={onLetterChange}
                onNavigate={onNavigate}
                onSetEditingBox={onSetEditingBox}
                onToggleArrowDown={onToggleArrowDown ?? (() => {})}
                onToggleArrowRight={onToggleArrowRight ?? (() => {})}
                onToggleBlack={onToggleBlack ?? (() => {})}
                onToggleHint={onToggleHint ?? (() => {})}
                onToggleHyphenBottom={onToggleHyphenBottom ?? (() => {})}
                onToggleHyphenRight={onToggleHyphenRight ?? (() => {})}
                onToggleStopDown={onToggleStopDown ?? (() => {})}
                onToggleStopRight={onToggleStopRight ?? (() => {})}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
