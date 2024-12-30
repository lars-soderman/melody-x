'use client';

import { OptionsButton } from '@/components/grid/settings/OptionsButton';
import { useRef } from 'react';

type BoxInputProps = {
  black?: boolean;
  boxSize: number;
  hint?: number;
  id: string;
  isSelected?: boolean;
  letter: string | null;
  onArrowDown: () => void;
  onArrowRight: () => void;
  onBlack: () => void;
  onLetterChange: (id: string, letter: string) => void;
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onStopDown: () => void;
  onStopRight: () => void;
  showOptions: boolean;
  toggleHint: (id: string) => void;
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
  onStopDown,
  onStopRight,
  toggleHint,
  showOptions,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const validLetterRegex = /^[a-zA-ZÅÄÖ-]$/i;

    if (value === '' || validLetterRegex.test(value)) {
      onLetterChange(id, value.toUpperCase());
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        autoFocus
        maxLength={1}
        type="text"
        value={letter || ''}
        className={`z-10 w-full cursor-pointer text-center text-4xl uppercase ${
          black ? 'bg-black text-white' : 'bg-white'
        } focus:outline-blue-500 focus:ring-blue-500 focus-visible:outline-8`}
        style={{
          fontSize: 'clamp(12px, 4vw, 32px)',
          color: black ? 'white' : 'black',
        }}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={(e) => {
          if (letter) {
            e.currentTarget.select();
          }
        }}
      />
      {isSelected && showOptions && (
        <OptionsButton
          toggleHint={() => toggleHint(id)}
          onArrowDown={onArrowDown}
          onArrowRight={onArrowRight}
          onBlack={onBlack}
          onStopDown={onStopDown}
          onStopRight={onStopRight}
        />
      )}
    </>
  );
}
