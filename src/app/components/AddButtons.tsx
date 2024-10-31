type AddButtonsProps = {
  onAddColumn: (position: 'left' | 'right') => void;
  onAddRow: (position: 'top' | 'bottom') => void;
};

export function AddButtons({ onAddRow, onAddColumn }: AddButtonsProps) {
  return (
    <>
      <button
        className="absolute -top-12 left-1/2 h-10 w-full -translate-x-1/2 rounded bg-slate-50 p-2 text-2xl opacity-0 transition-opacity hover:opacity-100"
        onClick={() => onAddRow('top')}
      >
        +
      </button>
      <button
        className="absolute -left-12 top-1/2 h-full w-10 -translate-y-1/2 rounded bg-slate-50 p-2 text-2xl opacity-0 transition-opacity hover:opacity-100"
        onClick={() => onAddColumn('left')}
      >
        +
      </button>
      <button
        className="absolute -bottom-12 left-1/2 h-10 w-full -translate-x-1/2 rounded bg-slate-50 p-2 text-2xl opacity-0 transition-opacity hover:opacity-100"
        onClick={() => onAddRow('bottom')}
      >
        +
      </button>
      <button
        className="absolute -right-12 top-1/2 h-full w-10 -translate-y-1/2 rounded bg-slate-50 p-2 text-2xl opacity-0 transition-opacity hover:opacity-100"
        onClick={() => onAddColumn('right')}
      >
        +
      </button>
    </>
  );
}
