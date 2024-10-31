import { BOX_SIZE } from '@/constants';
import { Box } from '@/types';
type RemoveButtonsProps = {
  confirmingRemove: { index: number; type: 'row' | 'column' } | null;
  grid: Box[][];
  handleRemoveColumn: (colIndex: number) => void;
  handleRemoveRow: (rowIndex: number) => void;
  maxCol: number;
  maxRow: number;
  minCol: number;
  minRow: number;
};

export function RemoveButtons({
  grid,
  minRow,
  minCol,
  maxRow,
  maxCol,
  handleRemoveRow,
  handleRemoveColumn,
  confirmingRemove,
}: RemoveButtonsProps) {
  return (
    <>
      {grid.map((row) =>
        row.map((box) => (
          <div key={`remove-${box.row}-${box.col}`}>
            {/* Left edge - row remove buttons */}
            {box.col === minCol && (
              <div
                className="hover-trigger absolute h-16"
                style={{
                  top: `${(box.row - minRow) * BOX_SIZE}px`,
                  left: 0,
                  width: `${BOX_SIZE * 0.2}px`, // Thin strip on the edge
                }}
              >
                <button
                  aria-label="Remove row"
                  className={`hover-target absolute left-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lg text-gray-400 opacity-0 shadow-sm transition-all duration-200 hover:bg-red-50 hover:text-red-500 ${
                    confirmingRemove?.type === 'row' &&
                    confirmingRemove.index === box.row
                      ? 'bg-red-50 text-red-500 opacity-100'
                      : ''
                  } `}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveRow(box.row);
                  }}
                >
                  {confirmingRemove?.type === 'row' &&
                  confirmingRemove.index === box.row
                    ? '×'
                    : '−'}
                </button>
              </div>
            )}

            {/* Top edge - column remove buttons */}
            {box.row === minRow && (
              <div
                className="hover-trigger absolute w-16"
                style={{
                  left: `${(box.col - minCol) * BOX_SIZE}px`,
                  top: 0,
                  height: `${BOX_SIZE * 0.2}px`, // Thin strip on the edge
                }}
              >
                <button
                  aria-label="Remove column"
                  className={`hover-target absolute left-1/2 top-1 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-white text-lg text-gray-400 opacity-0 shadow-sm transition-all duration-200 hover:bg-red-50 hover:text-red-500 ${
                    confirmingRemove?.type === 'column' &&
                    confirmingRemove.index === box.col
                      ? 'bg-red-50 text-red-500 opacity-100'
                      : ''
                  } `}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveColumn(box.col);
                  }}
                >
                  {confirmingRemove?.type === 'column' &&
                  confirmingRemove.index === box.col
                    ? '×'
                    : '−'}
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </>
  );
}
