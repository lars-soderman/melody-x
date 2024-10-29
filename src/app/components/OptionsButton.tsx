import { useState } from 'react';
import { Popover } from './Popover';

type OptionsButtonProps = {
  onArrowDown: () => void;
  onArrowRight: () => void;
  onBlack: () => void;
  onHint: () => void;
  onStop: () => void;
};

export function OptionsButton(props: OptionsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      position="right"
      focusTrap={false}
      trigger={
        <button
          className="rounded-2 absolute right-[2px] top-[2px] z-10 flex h-6 w-6 cursor-pointer items-center justify-center border-none bg-transparent text-xl font-bold hover:bg-gray-100 active:bg-gray-200"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Show options"
        >
          ⋮
        </button>
      }
    >
      <div className="flex flex-col gap-1">
        <button
          onClick={props.onArrowDown}
          className="block w-full px-3 text-left hover:bg-slate-100"
        >
          Arrow Down
        </button>
        <button
          onClick={props.onArrowRight}
          className="block w-full px-3 text-left hover:bg-slate-100"
        >
          Arrow Right
        </button>
        <button
          onClick={props.onBlack}
          className="block w-full px-3 text-left hover:bg-slate-100"
        >
          Black
        </button>
      </div>
    </Popover>
  );
}
