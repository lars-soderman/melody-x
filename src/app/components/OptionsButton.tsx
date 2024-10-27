import { useState } from 'react';

type OptionsButtonProps = {
  onArrowDown: () => void;
  onArrowRight: () => void;
  onBlack: () => void;
  onHint: () => void;
  onStop: () => void;
};

const Popover = ({
  onArrowDown,
  onArrowRight,
  onBlack,
  onHint,
  onStop,
}: OptionsButtonProps) => {
  return (
    <div className="absolute right-0 top-8 z-10 flex min-w-max flex-col gap-1 rounded border border-black bg-white py-2 shadow-lg">
      <button
        onClick={onArrowDown}
        className="block w-full px-3 text-left hover:bg-slate-100"
      >
        Arrow Down
      </button>
      <button
        onClick={onArrowRight}
        className="block w-full px-3 text-left hover:bg-slate-100"
      >
        Arrow Right
      </button>
      <button
        onClick={onBlack}
        className="block w-full px-3 text-left hover:bg-slate-100"
      >
        Black
      </button>
      {/* <button onClick={onHint} className="block w-full text-left">
        Hint
      </button>
      <button onClick={onStop} className="block w-full text-left">
        Stop
      </button> */}
    </div>
  );
};

export function OptionsButton(props: OptionsButtonProps) {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <>
      <button
        className="rounded-2 absolute right-[2px] top-[2px] z-10 flex h-6 w-6 cursor-pointer items-center justify-center border-none bg-transparent text-xl font-bold hover:bg-gray-100 active:bg-gray-200"
        onClick={() => setShowPopover(!showPopover)}
        aria-label="Show options"
      >
        ⋮
      </button>
      {showPopover && <Popover {...props} />}
    </>
  );
}
