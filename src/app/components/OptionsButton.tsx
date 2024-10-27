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
    <div className="absolute right-0 top-8 z-10 rounded border border-black bg-white p-2 shadow-lg">
      <button onClick={onArrowDown} className="block w-full text-left">
        Arrow Down
      </button>
      <button onClick={onArrowRight} className="block w-full text-left">
        Arrow Right
      </button>
      <button onClick={onBlack} className="block w-full text-left">
        Black
      </button>
      <button onClick={onHint} className="block w-full text-left">
        Hint
      </button>
      <button onClick={onStop} className="block w-full text-left">
        Stop
      </button>
    </div>
  );
};

export function OptionsButton(props: OptionsButtonProps) {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <>
      <button
        className="absolute right-0 top-2 flex h-4 w-4 cursor-pointer items-center justify-center border-none bg-transparent"
        onClick={() => setShowPopover(!showPopover)}
        aria-label="Show options"
      >
        ⋮
      </button>
      {showPopover && <Popover {...props} />}
    </>
  );
}
