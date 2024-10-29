import { Box } from '@/types';
import { getId } from '@/utils/grid';
import { BoxInput } from './BoxInput';
import { ShowBox } from './ShowBox';

type GridCellProps = {
  box: Box;
  editingBox: Box | null;
  onLetterChange: (id: string, letter: string) => void;
  onUpdateArrow: (id: string, direction: 'down' | 'right') => void;
  onUpdateBlack: (id: string, isBlack: boolean) => void;
  onNavigate: (box: Box, direction: 'up' | 'down' | 'left' | 'right') => void;
  onSetEditingBox: (box: Box) => void;
  boxSize: number;
};

export function GridCell({
  box,
  editingBox,
  onLetterChange,
  onUpdateArrow,
  onUpdateBlack,
  onNavigate,
  onSetEditingBox,
  boxSize,
}: GridCellProps) {
  return (
    <div className="relative flex">
      {editingBox === box ? (
        <BoxInput
          id={getId(box)}
          letter={box.letter}
          boxSize={boxSize}
          isSelected={editingBox === box}
          onLetterChange={onLetterChange}
          onArrowDown={() => onUpdateArrow(getId(box), 'down')}
          onArrowRight={() => onUpdateArrow(getId(box), 'right')}
          onBlack={() => onUpdateBlack(getId(box), !box.black)}
          black={box.black}
          onNavigate={(direction) => onNavigate(box, direction)}
        />
      ) : (
        <ShowBox
          id={getId(box)}
          letter={box.letter}
          onClick={() => onSetEditingBox(box)}
          row={box.row}
          col={box.col}
          arrow={box.arrow}
          stop={box.stop}
          black={box.black}
          hint={box.hint}
          boxSize={boxSize}
          onNavigate={(direction) => onNavigate(box, direction)}
        />
      )}
    </div>
  );
}