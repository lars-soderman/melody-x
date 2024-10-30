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

function getButtonSymbol(
  confirmingRemove: { type: 'row' | 'column'; index: number } | null,
  type: 'row' | 'column',
  index: number
): string {
  return confirmingRemove?.type === type && confirmingRemove.index === index
    ? '×'
    : '-';
}

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
                  className={`invisible absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 hover:bg-gray-200 group-hover:visible`}
                  aria-label="Remove row"
                >
                  {getButtonSymbol(confirmingRemove, 'row', box.row)}
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
                  className={`invisible absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 hover:bg-gray-200 group-hover:visible`}
                  aria-label="Remove row"
                >
                  {getButtonSymbol(confirmingRemove, 'row', box.row)}
                </button>
              </div>
            )}

            {/* Top edge - column remove buttons */}
            {box.row === minRow && (
              <div
                className="group absolute top-0 h-6 w-16 hover:bg-gray-50"
                style={{
                  left: `${(box.col - minCol) * BOX_SIZE}px`,
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveColumn(box.col);
                  }}
                  className={`invisible absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 hover:bg-gray-200 group-hover:visible`}
                  aria-label="Remove column"
                >
                  {getButtonSymbol(confirmingRemove, 'column', box.col)}
                </button>
              </div>
            )}

            {/* Bottom edge - column remove buttons */}
            {box.row === maxRow && (
              <div
                className="group absolute bottom-0 h-6 w-16 hover:bg-gray-50"
                style={{
                  left: `${(box.col - minCol) * BOX_SIZE}px`,
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveColumn(box.col);
                  }}
                  className={`invisible absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 hover:bg-gray-200 group-hover:visible`}
                  aria-label="Remove column"
                >
                  {getButtonSymbol(confirmingRemove, 'column', box.col)}
                </button>
              </div>
            )}
          </>
        ))
      )}
    </>
  );
}
