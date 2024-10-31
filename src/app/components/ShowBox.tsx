'use client';
import { Box } from '@types';
import { ArrowDown } from '../icons/arrowDown';
import { ArrowRight } from '../icons/arrowRight';

type ShowBoxProps = Box & {
  black?: boolean;
  boxSize: number;
  id: string;
  isSelected?: boolean;
  onClick: () => void;
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
};

export function ShowBox({
  letter,
  onClick,
  onNavigate,
  black,
  arrow,
  stop,
  hint,
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
        tabIndex={0}
        className={`relative w-full cursor-pointer text-center text-2xl uppercase md:text-4xl ${
          black ? 'bg-black text-white' : 'bg-white'
        }`}
        onClick={onClick}
        onKeyDown={handleKeyDown}
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
      {hint && (
        <div className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm font-bold ring-1 ring-black">
          {hint}
        </div>
      )}
    </>
  );
}
