type BoxSizeControlProps = {
  onChange: (size: number) => void;
  size: number;
};

export function BoxSizeControl({ size, onChange }: BoxSizeControlProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        aria-label="Decrease grid size"
        className="h-6 w-6 rounded text-gray-400 transition-colors hover:bg-gray-200"
        onClick={() => onChange(size - 8)}
      >
        -
      </button>
      <span className="text-sm text-gray-500">{size}</span>
      <button
        aria-label="Increase grid size"
        className="h-6 w-6 rounded text-gray-400 transition-colors hover:bg-gray-200"
        onClick={() => onChange(size + 8)}
      >
        +
      </button>
    </div>
  );
}
