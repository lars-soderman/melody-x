type AddGridButtonsProps = {
  onAddColumn: (position: 'left' | 'right') => void;
  onAddRow: (position: 'top' | 'bottom') => void;
};

export function AddGridButtons({ onAddRow, onAddColumn }: AddGridButtonsProps) {
  return (
    <>
      <button
        aria-label="Add row at top"
        className="absolute -top-12 left-1/2 h-10 w-full -translate-x-1/2 rounded bg-slate-50 p-2 text-2xl opacity-0 transition-opacity hover:opacity-100"
        onClick={() => onAddRow('top')}
      >
        +
      </button>
      <button
        aria-label="Add column at left"
        className="absolute -left-12 top-1/2 h-full w-10 -translate-y-1/2 rounded bg-slate-50 p-2 text-2xl opacity-0 transition-opacity hover:opacity-100"
        onClick={() => onAddColumn('left')}
      >
        +
      </button>
      <button
        aria-label="Add row at bottom"
        className="absolute -bottom-12 left-1/2 h-10 w-full -translate-x-1/2 rounded bg-slate-50 p-2 text-2xl opacity-0 transition-opacity hover:opacity-100"
        onClick={() => onAddRow('bottom')}
      >
        +
      </button>
      <button
        aria-label="Add column at right"
        className="absolute -right-12 top-1/2 h-full w-10 -translate-y-1/2 rounded bg-slate-50 p-2 text-2xl opacity-0 transition-opacity hover:opacity-100"
        onClick={() => onAddColumn('right')}
      >
        +
      </button>
    </>
  );
}
