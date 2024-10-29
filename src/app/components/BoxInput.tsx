'use client';

import { OptionsButton } from '@components/OptionsButton';
import { useRef } from 'react';

type BoxInputProps = {
  letter: string | null;
  onLetterChange: (id: string, letter: string) => void;
  onArrowDown: () => void;
  onArrowRight: () => void;
  onBlack: () => void;
  black?: boolean;
  isSelected?: boolean;
  id: string;
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
  boxSize: number;
  onStopBottom: () => void;
  onStopRight: () => void;
};

export function BoxInput({
  letter,
  onLetterChange,
  onArrowDown,
  onArrowRight,
  onBlack,
  black,
  isSelected,
  id,
  onNavigate,
  boxSize,
  onStopBottom,
  onStopRight,
}: BoxInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        onNavigate('right');
        break;
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
      <input
        ref={inputRef}
        autoFocus
        type="text"
        value={letter || ''}
        onChange={(e) => {
          const value = e.target.value;
          if (value.length <= 1) {
            onLetterChange(id, value.toUpperCase());
          }
        }}
        onKeyDown={handleKeyDown}
        onFocus={(e) => {
          if (letter) {
            e.currentTarget.select();
          }
        }}
        className={`z-10 cursor-pointer border-2 border-black text-center text-4xl uppercase text-gray-500 ${
          black ? 'bg-black text-white' : 'bg-white'
        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        style={{ height: `${boxSize}px`, width: `${boxSize}px` }}
        maxLength={1}
      />
      {isSelected && (
        <OptionsButton
          onArrowDown={onArrowDown}
          onArrowRight={onArrowRight}
          onBlack={onBlack}
          onStopBottom={onStopBottom}
          onStopRight={onStopRight}
          onHint={() => console.log('Hint')}
          onStop={() => console.log('Stop')}
        />
      )}
    </>
  );
}
