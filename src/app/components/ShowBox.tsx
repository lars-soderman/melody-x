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
  stop,
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
        // style={{
        //   width: `${Math.max(boxSize, 40)}px`,
        //   height: `${Math.max(boxSize, 40)}px`, // Minimum height of 40px
        // }}
        className={`relative w-full cursor-pointer text-center text-2xl uppercase md:text-4xl ${
          black ? 'bg-black text-white' : 'bg-white'
        }`}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {letter}
        {stop === 'bottom' && (
          <div className="absolute bottom-0 left-0 h-[3px] w-full bg-black" />
        )}
        {stop === 'right' && (
          <div className="absolute right-0 top-0 h-full w-[3px] bg-black" />
        )}
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
