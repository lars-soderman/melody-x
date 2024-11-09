import { Box } from '@/types';
import { getId } from '@/utils/grid';
import { memo } from 'react';
import { BoxInput } from './BoxInput';
import { ShowBox } from './ShowBox';

type GridCellProps = {
  box: Box;
  boxSize: number;
  editingBox: Box | null;
  onLetterChange: (id: string, letter: string) => void;
  onNavigate: (box: Box, direction: 'up' | 'down' | 'left' | 'right') => void;
  onSetEditingBox: (box: Box) => void;
  onUpdateArrow: (id: string, direction: 'down' | 'right') => void;
  onUpdateBlack: (id: string, isBlack: boolean) => void;
  onUpdateStop: (id: string, stop: 'bottom' | 'right') => void;
  toggleHint: (id: string) => void;
};

export const GridCell = memo(function GridCell({
  box,
  editingBox,
  onLetterChange,
  onUpdateArrow,
  onUpdateBlack,
  onNavigate,
  onSetEditingBox,
  onUpdateStop,
  boxSize,
  toggleHint,
}: GridCellProps) {
  return (
    <div
      className="relative flex"
      data-testid={`grid-cell`}
      style={{
        width: `${boxSize}px`,
        height: `${boxSize}px`,
        borderWidth: `${boxSize * 0.03}px`,
        borderStyle: 'solid',
        borderColor: 'black',
      }}
    >
      {editingBox === box ? (
        <BoxInput
          black={box.black}
          boxSize={boxSize}
          id={getId(box)}
          isSelected={editingBox === box}
          letter={box.letter}
          toggleHint={toggleHint}
          onArrowDown={() => onUpdateArrow(getId(box), 'down')}
          onArrowRight={() => onUpdateArrow(getId(box), 'right')}
          onBlack={() => onUpdateBlack(getId(box), !box.black)}
          onLetterChange={onLetterChange}
          onNavigate={(direction) => onNavigate(box, direction)}
          onStopBottom={() => onUpdateStop(getId(box), 'bottom')}
          onStopRight={() => onUpdateStop(getId(box), 'right')}
        />
      ) : (
        <ShowBox
          arrow={box.arrow}
          black={box.black}
          boxSize={boxSize}
          col={box.col}
          hint={box.hint}
          id={getId(box)}
          letter={box.letter}
          row={box.row}
          stop={box.stop}
          onClick={() => onSetEditingBox(box)}
          onNavigate={(direction) => onNavigate(box, direction)}
        />
      )}
    </div>
  );
});
