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
  onToggleArrowDown?: (id: string) => void;
  onToggleArrowRight?: (id: string) => void;
  onToggleBlack?: (id: string, isBlack: boolean) => void;
  onToggleStopDown?: (id: string) => void;
  onToggleStopRight?: (id: string) => void;
  showOptions: boolean;
  toggleHint?: (id: string) => void;
};

export const GridCell = memo(function GridCell({
  box,
  editingBox,
  onLetterChange,
  onToggleArrowDown,
  onToggleArrowRight,
  onToggleBlack,
  onNavigate,
  onSetEditingBox,
  onToggleStopDown,
  onToggleStopRight,
  toggleHint,
  showOptions = true,
}: GridCellProps) {
  const boxSize = INITIAL_BOX_SIZE;
  return (
    <div
      className="relative flex aspect-square"
      data-testid="grid-cell"
      style={{
        borderWidth: '0.15vw',
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
          showOptions={showOptions}
          toggleHint={toggleHint ?? (() => null)}
          onArrowDown={() => onToggleArrowDown?.(getId(box))}
          onArrowRight={() => onToggleArrowRight?.(getId(box))}
          onBlack={() => onToggleBlack?.(getId(box), !box.black)}
          onLetterChange={onLetterChange}
          onNavigate={(direction) => onNavigate(box, direction)}
          onStopDown={() => onToggleStopDown?.(getId(box))}
          onStopRight={() => onToggleStopRight?.(getId(box))}
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
