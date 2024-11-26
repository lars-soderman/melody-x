'use client';
import { ArrowDown } from '@/components/ui/icons/arrowDown';
import { ArrowRight } from '@/components/ui/icons/arrowRight';
import { Box } from '@types';

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
  id,
  onClick,
  // onNavigate,
  black,
  arrowRight,
  arrowDown,
  stopDown,
  stopRight,
  hint,
}: ShowBoxProps) {
  // const handleKeyDown = (e: React.KeyboardEvent) => {
  //   switch (e.key) {
  //     case 'ArrowUp':
  //       e.preventDefault();
  //       onNavigate('up');
  //       break;
  //     case 'ArrowDown':
  //       e.preventDefault();
  //       onNavigate('down');
  //       break;
  //     case 'ArrowLeft':
  //       e.preventDefault();
  //       onNavigate('left');
  //       break;
  //     case 'ArrowRight':
  //       e.preventDefault();
  //       onNavigate('right');
  //       break;
  //   }
  // };

  return (
    <>
      <button
        data-letter={!!letter}
        data-position={id}
        data-testid={`grid-cell-${id}`}
        tabIndex={0}
        className={`relative w-full cursor-pointer text-center uppercase ${
          black ? 'bg-black' : 'bg-white'
        }`}
        onClick={onClick}
      >
        {letter && (
          <span
            className="absolute inset-0 flex items-center justify-center"
            style={{
              fontSize: 'clamp(12px, 4vw, 32px)',
              color: black ? 'white' : 'black',
            }}
          >
            {letter}
          </span>
        )}
        {hint && (
          <div
            className="absolute flex h-5 w-5 items-center justify-center"
            data-hint={true}
            style={{
              left: '2px',
              top: '2px',
              fontSize: 'clamp(8px, 1.5vw, 12px)',
            }}
          >
            <span>{hint}</span>
          </div>
        )}
        {stopDown && (
          <div
            className="absolute bottom-0 left-0 h-[3px] w-full bg-black"
            data-stop="bottom"
          />
        )}
        {stopRight && (
          <div
            className="absolute right-0 top-0 h-full w-[3px] bg-black"
            data-stop="right"
          />
        )}
        {arrowRight && (
          <div className="absolute bottom-1 left-1" data-testid="arrow-right">
            <ArrowRight className="h-4 w-4 text-black" />
          </div>
        )}
        {arrowDown && (
          <div className="absolute right-1 top-1" data-testid="arrow-down">
            <ArrowDown className="h-4 w-4 text-black" />
          </div>
        )}
      </button>
    </>
  );
}
