'use client';
import { Box } from '@types';
import { ArrowDown } from '../icons/arrowDown';
import { ArrowRight } from '../icons/arrowRight';

type ShowBoxProps = Box & {
  onClick: () => void;
  id: string;
  isSelected?: boolean;
  black?: boolean;
};

export function ShowBox({
  id,
  letter,
  onClick,
  black,
  isSelected,
  arrow,
}: ShowBoxProps) {
  return (
    <>
      <button
        className={`h-16 w-16 cursor-pointer border border-black text-center text-3xl uppercase ${
          black ? 'bg-black text-white' : 'bg-white'
        }`}
        onClick={onClick}
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
