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
                className="group absolute -left-10 flex h-16 w-10 items-center justify-center"
                style={{
                  top: `${(box.row - minRow) * BOX_SIZE}px`,
                }}
              >
                <button
                  aria-label="Remove row"
                  className={`flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg text-gray-400 opacity-0 shadow-sm transition-all duration-200 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 ${
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
                className="group absolute -top-10 flex h-10 w-16 items-center justify-center"
                style={{
                  left: `${(box.col - minCol) * BOX_SIZE}px`,
                }}
              >
                <button
                  aria-label="Remove column"
                  className={`flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg text-gray-400 opacity-0 shadow-sm transition-all duration-200 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 ${
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
