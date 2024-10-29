type BoxSizeControlProps = {
  size: number;
  onChange: (size: number) => void;
};

export function BoxSizeControl({ size, onChange }: BoxSizeControlProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(size - 8)}
        className="h-6 w-6 rounded text-gray-400 transition-colors hover:bg-gray-200"
        aria-label="Decrease grid size"
      >
        -
      </button>
      <span className="text-sm text-gray-500">{size}</span>
      <button
        onClick={() => onChange(size + 8)}
        className="h-6 w-6 rounded text-gray-400 transition-colors hover:bg-gray-200"
        aria-label="Increase grid size"
      >
        +
      </button>
    </div>
  );
}
