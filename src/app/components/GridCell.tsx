import { INITIAL_BOX_SIZE } from '@/constants';
import { Box } from '@/types';
import { getId } from '@/utils/grid';
import { memo } from 'react';
import { BoxInput } from './BoxInput';
import { ShowBox } from './ShowBox';

type GridCellProps = {
  box: Box;

  editingBox: Box | null;
  onLetterChange: (id: string, letter: string) => void;
  onNavigate: (box: Box, direction: 'up' | 'down' | 'left' | 'right') => void;
  onSetEditingBox: (box: Box) => void;
  onUpdateArrowDown: (id: string) => void;
  onUpdateArrowRight: (id: string) => void;
  onUpdateBlack: (id: string, isBlack: boolean) => void;
  onUpdateStopDown: (id: string) => void;
  onUpdateStopRight: (id: string) => void;
  toggleHint: (id: string) => void;
};

export const GridCell = memo(function GridCell({
  box,
  editingBox,
  onLetterChange,
  onUpdateArrowDown,
  onUpdateArrowRight,
  onUpdateBlack,
  onNavigate,
  onSetEditingBox,
  onUpdateStopDown,
  onUpdateStopRight,
  toggleHint,
}: GridCellProps) {
  const boxSize = INITIAL_BOX_SIZE;
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
          onArrowDown={() => onUpdateArrowDown(getId(box))}
          onArrowRight={() => onUpdateArrowRight(getId(box))}
          onBlack={() => onUpdateBlack(getId(box), !box.black)}
          onLetterChange={onLetterChange}
          onNavigate={(direction) => onNavigate(box, direction)}
          onStopDown={() => onUpdateStopDown(getId(box))}
          onStopRight={() => onUpdateStopRight(getId(box))}
        />
      ) : (
        <ShowBox
          arrowDown={box.arrowDown}
          arrowRight={box.arrowRight}
          black={box.black}
          boxSize={boxSize}
          col={box.col}
          hint={box.hint}
          id={getId(box)}
          letter={box.letter}
          row={box.row}
          stopDown={box.stopDown}
          stopRight={box.stopRight}
          onClick={() => onSetEditingBox(box)}
          onNavigate={(direction) => onNavigate(box, direction)}
        />
      )}
    </div>
  );
});
