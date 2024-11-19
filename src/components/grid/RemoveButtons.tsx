import { INITIAL_BOX_SIZE } from '@/constants';
import { Box } from '@/types';
import React from 'react';

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
  maxRow,
  minCol,
  maxCol,
  handleRemoveRow,
  handleRemoveColumn,
  confirmingRemove,
}: RemoveButtonsProps) {
  const boxSize = INITIAL_BOX_SIZE;
  return (
    <>
      {grid.map((row) =>
        row.map((box) => (
          <React.Fragment key={`remove-${box.row}-${box.col}`}>
            {/* Left edge - row remove buttons */}
            {box.col === minCol && (
              <div
                className="hover-trigger absolute z-30"
                data-testid={`remove-row-hover-trigger-${box.row}`}
                style={{
                  top: `${(box.row - minRow) * boxSize}px`,
                  left: 0,
                  width: `${boxSize * 0.05}px`,
                  height: `${boxSize}px`,
                }}
              >
                <button
                  className={`hover-target absolute -left-3 top-1/2 flex h-8 w-6 -translate-y-1/2 items-center justify-center bg-white text-lg text-gray-400 opacity-0 shadow-md transition-all duration-200 ${
                    confirmingRemove?.type === 'row' &&
                    confirmingRemove.index === box.row
                      ? 'bg-red-50 text-gray-500 opacity-100'
                      : ''
                  } `}
                  title={
                    confirmingRemove?.type === 'row' &&
                    confirmingRemove.index === box.row
                      ? `Confirm remove row ${box.row}`
                      : `Remove row ${box.row}`
                  }
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
            {/* Right edge - row remove buttons */}
            {box.col === maxCol && (
              <div
                className="hover-trigger absolute z-30"
                data-testid={`remove-row-hover-trigger-${box.row}`}
                style={{
                  top: `${(box.row - minRow) * boxSize}px`,
                  right: 0,
                  width: `${boxSize * 0.05}px`,
                  height: `${boxSize}px`,
                }}
              >
                <button
                  aria-label="Remove row"
                  data-testid={`remove-row-${box.row}`}
                  title="Remove row"
                  className={`hover-target absolute -right-3 top-1/2 flex h-8 w-6 -translate-y-1/2 items-center justify-center bg-white text-lg text-gray-400 opacity-0 shadow-md transition-all duration-200 ${
                    confirmingRemove?.type === 'row' &&
                    confirmingRemove.index === box.row
                      ? 'bg-red-50 text-gray-500 opacity-100'
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
                className="hover-trigger absolute z-30"
                style={{
                  top: 0,
                  left: `${(box.col - minCol) * boxSize}px`,
                  height: `${boxSize * 0.05}px`,
                  width: `${boxSize}px`,
                }}
              >
                <button
                  aria-label="Remove column"
                  title="Remove column"
                  className={`hover-target absolute -top-3 left-1/2 flex h-8 w-6 -translate-x-1/2 items-center justify-center bg-white text-lg text-gray-400 opacity-0 shadow-md transition-all duration-200 ${
                    confirmingRemove?.type === 'column' &&
                    confirmingRemove.index === box.col
                      ? 'bg-red-50 text-gray-500 opacity-100'
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
            {/* Bottom edge - column remove buttons */}
            {box.row === maxRow && (
              <div
                className="hover-trigger absolute z-30"
                style={{
                  bottom: 0,
                  left: `${(box.col - minCol) * boxSize}px`,
                  height: `${boxSize * 0.05}px`,
                  width: `${boxSize}px`,
                }}
              >
                <button
                  aria-label="Remove column"
                  data-testid={`remove-col-${box.col}`}
                  title="Remove column"
                  className={`hover-target absolute -bottom-3 left-1/2 flex h-8 w-6 -translate-x-1/2 items-center justify-center bg-white text-lg text-gray-400 opacity-0 shadow-md transition-all duration-200 ${
                    confirmingRemove?.type === 'column' &&
                    confirmingRemove.index === box.col
                      ? 'bg-red-50 text-gray-500 opacity-100'
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
          </React.Fragment>
        ))
      )}
    </>
  );
}
