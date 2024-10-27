'use client';

import { OptionsButton } from '@components/OptionsButton';

type BoxInputProps = {
  letter: string | null;
  onLetterChange: (id: string, letter: string) => void;
  onArrowDown: () => void;
  onArrowRight: () => void;
  black?: boolean;
  isSelected?: boolean;
  id: string;
};

export function BoxInput({
  letter,
  onLetterChange,
  onArrowDown,
  onArrowRight,
  black,
  isSelected,
  id,
}: BoxInputProps) {
  return (
    <>
      <input
        autoFocus
        type="text"
        value={letter || ''}
        onChange={(e) => {
          const value = e.target.value;
          if (value.length <= 1) {
            onLetterChange(id, value.toUpperCase());
          }
        }}
        className={`h-16 w-16 cursor-pointer border border-black text-center uppercase ${
          black ? 'bg-black text-white' : 'bg-white'
        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        maxLength={1}
      />
      {isSelected && (
        <OptionsButton
          onArrowDown={onArrowDown}
          onArrowRight={onArrowRight}
          onBlack={() => console.log('Black')}
          onHint={() => console.log('Hint')}
          onStop={() => console.log('Stop')}
        />
      )}
    </>
  );
}
