type AddButtonsProps = {
  onAddRow: (position: 'top' | 'bottom') => void;
  onAddColumn: (position: 'left' | 'right') => void;
};

export function AddButtons({ onAddRow, onAddColumn }: AddButtonsProps) {
  return (
    <>
      <button
        onClick={() => onAddRow('top')}
        className="absolute -top-12 left-1/2 h-10 w-full -translate-x-1/2 rounded bg-slate-50 p-2 text-2xl opacity-0 transition-opacity hover:opacity-100"
      >
        +
      </button>
      <button
        onClick={() => onAddColumn('left')}
        className="absolute -left-12 top-1/2 h-full w-10 -translate-y-1/2 rounded bg-slate-50 p-2 text-2xl opacity-0 transition-opacity hover:opacity-100"
      >
        +
      </button>
      <button
        onClick={() => onAddRow('bottom')}
        className="absolute -bottom-12 left-1/2 h-10 w-full -translate-x-1/2 rounded bg-slate-50 p-2 text-2xl opacity-0 transition-opacity hover:opacity-100"
      >
        +
      </button>
      <button
        onClick={() => onAddColumn('right')}
        className="absolute -right-12 top-1/2 h-full w-10 -translate-y-1/2 rounded bg-slate-50 p-2 text-2xl opacity-0 transition-opacity hover:opacity-100"
      >
        +
      </button>
    </>
  );
}
