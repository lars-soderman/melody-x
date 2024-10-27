type PopoverProps = {
  onArrow: () => void;
  onBlack: () => void;
  onHint: () => void;
  onStop: () => void;
};

export const Popover = ({ onArrow, onBlack, onHint, onStop }: PopoverProps) => {
  return (
    <div className="absolute right-0 top-8 rounded border border-black bg-white p-2 shadow-lg">
      <button onClick={onArrow} className="block w-full text-left">
        Arrow
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
