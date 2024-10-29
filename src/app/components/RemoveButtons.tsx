import { BOX_SIZE } from '@/constants';
import { Box } from '@/types';

type RemoveButtonsProps = {
  grid: Box[][];
  minRow: number;
  minCol: number;
  maxRow: number;
  maxCol: number;
  handleRemoveRow: (rowIndex: number) => void;
  handleRemoveColumn: (colIndex: number) => void;
  confirmingRemove: { type: 'row' | 'column'; index: number } | null;
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
          <>
            {/* Right edge - row remove buttons */}
            {box.col === maxCol && (
              <div
                className="group absolute right-0 h-16 w-6 hover:bg-gray-50"
                style={{
                  top: `${(box.row - minRow) * BOX_SIZE}px`,
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveRow(box.row);
                  }}
                  className={`invisible absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:visible ${
                    confirmingRemove?.type === 'row' &&
                    confirmingRemove.index === box.row
                      ? 'text-red-500'
                      : 'text-gray-400'
                  } hover:bg-gray-200`}
                  aria-label="Remove row"
                >
                  -
                </button>
              </div>
            )}

            {/* Left edge - row remove buttons */}
            {box.col === minCol && (
              <div
                className="group absolute left-0 h-16 w-6 hover:bg-gray-50"
                style={{
                  top: `${(box.row - minRow) * BOX_SIZE}px`,
                  left: '-24px',
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveRow(box.row);
                  }}
                  className={`invisible absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:visible ${
                    confirmingRemove?.type === 'row' &&
                    confirmingRemove.index === box.row
                      ? 'text-red-500'
                      : 'text-gray-400'
                  } hover:bg-gray-200`}
                  aria-label="Remove row"
                >
                  -
                </button>
              </div>
            )}
          </>
        ))
      )}
    </>
  );
}
