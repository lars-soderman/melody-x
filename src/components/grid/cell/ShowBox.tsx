'use client';
import { ArrowDown } from '@/components/ui/icons/arrowDown';
import { ArrowRight } from '@/components/ui/icons/arrowRight';
import { Box } from '@types';

type ShowBoxProps = Box & {
  black?: boolean;
  boxSize: number;
  hyphenBottom?: boolean;
  hyphenRight?: boolean;
  id: string;
  isSelected?: boolean;
  onClick: () => void;
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
};

export function ShowBox({
  letter,
  id,
  onClick,
  black,
  arrowRight,
  arrowDown,
  stopDown,
  stopRight,
  hint,
  hyphenBottom,
  hyphenRight,
}: ShowBoxProps) {
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
            data-hidden={true}
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
            style={{
              left: '2px',
              top: '2px',
              fontSize: 'clamp(8px, 1.5vw, 12px)',
            }}
          >
            <span data-hint={true}>{hint}</span>
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
        {hyphenBottom && (
          <div
            className="absolute -bottom-[2px] left-1/2 z-10 h-5 w-1 translate-y-1/2 bg-black"
            data-hyphen="bottom"
          />
        )}
        {hyphenRight && (
          <div
            className="absolute -right-[2px] top-1/2 z-10 h-1 w-5 translate-x-1/2 bg-black"
            data-hyphen="right"
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
