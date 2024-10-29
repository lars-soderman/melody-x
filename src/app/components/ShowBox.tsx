'use client';
import { Box } from '@types';
import { ArrowDown } from '../icons/arrowDown';
import { ArrowRight } from '../icons/arrowRight';

type ShowBoxProps = Box & {
  onClick: () => void;
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
  id: string;
  isSelected?: boolean;
  black?: boolean;
  boxSize: number;
};

export function ShowBox({
  id,
  letter,
  onClick,
  onNavigate,
  black,
  isSelected,
  arrow,
  boxSize,
}: ShowBoxProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        onNavigate('up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        onNavigate('down');
        break;
      case 'ArrowLeft':
        e.preventDefault();
        onNavigate('left');
        break;
      case 'ArrowRight':
        e.preventDefault();
        onNavigate('right');
        break;
    }
  };

  return (
    <>
      <button
        style={{ height: `${boxSize}px`, width: `${boxSize}px` }}
        className={`cursor-pointer border-2 border-black text-center text-4xl uppercase ${
          black ? 'bg-black text-white' : 'bg-white'
        }`}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {letter}
      </button>
      {arrow === 'right' && (
        <div className="absolute bottom-1 left-1">
          <ArrowRight className="h-4 w-4 text-black" />
        </div>
      )}
      {arrow === 'down' && (
        <div className="absolute right-1 top-1">
          <ArrowDown className="h-4 w-4 text-black" />
        </div>
      )}
    </>
  );
}
