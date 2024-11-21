'use client';

import { Box } from '@/types';

type Props = {
  boxes: Box[];
  className?: string;
  cols: number;
  rows: number;
};

export function GridPreview({ boxes, cols, rows, className = '' }: Props) {
  const cellSize = 8;
  const padding = 2;
  const width = cols * cellSize + padding * 2;
  const height = rows * cellSize + padding * 2;
  const arrowSize = cellSize * 0.4;

  // Create empty grid
  const grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false)
  );

  // Mark used cells
  boxes.forEach((box) => {
    if (box.row < rows && box.col < cols) {
      grid[box.row][box.col] = true;
    }
  });

  return (
    <svg
      className={`${className} bg-white`}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
    >
      {/* Grid lines */}
      {grid.map((row, rowIndex) =>
        row.map((_, colIndex) => {
          const box = boxes.find(
            (b) => b.row === rowIndex && b.col === colIndex
          );

          return (
            <rect
              key={`${rowIndex}-${colIndex}`}
              fill={box?.black ? 'black' : 'white'}
              height={cellSize - 0.2}
              stroke="#e5e7eb"
              strokeWidth="0.2"
              width={cellSize - 0.2}
              x={colIndex * cellSize + padding}
              y={rowIndex * cellSize + padding}
            />
          );
        })
      )}

      {/* Arrows and hints */}
      {boxes.map((box) => {
        if (box.row >= rows || box.col >= cols) return null;

        const x = box.col * cellSize + padding;
        const y = box.row * cellSize + padding;
        const centerX = x + cellSize / 2;
        const centerY = y + cellSize / 2;

        return (
          <g key={`${box.row}-${box.col}`}>
            {/* Down arrow */}
            {box.arrowDown && (
              <path
                fill={box.black ? 'white' : 'black'}
                d={`M ${centerX} ${y} l ${arrowSize} ${arrowSize} l -${
                  arrowSize * 2
                } 0 z`}
              />
            )}

            {/* Right arrow */}
            {box.arrowRight && (
              <path
                fill={box.black ? 'white' : 'black'}
                d={`M ${x + cellSize - arrowSize} ${centerY} l ${arrowSize} -${arrowSize} l 0 ${
                  arrowSize * 2
                } z`}
              />
            )}

            {/* Stop markers */}
            {box.stopRight && (
              <line
                stroke={box.black ? 'white' : 'black'}
                strokeWidth="0.4"
                x1={x + cellSize - 0.5}
                x2={x + cellSize - 0.5}
                y1={y}
                y2={y + cellSize}
              />
            )}

            {box.stopDown && (
              <line
                stroke={box.black ? 'white' : 'black'}
                strokeWidth="0.4"
                x1={x}
                x2={x + cellSize}
                y1={y + cellSize - 0.5}
                y2={y + cellSize - 0.5}
              />
            )}

            {/* Hint number */}
            {box.hint && (
              <text
                fill={box.black ? 'white' : 'black'}
                fontSize={1.5}
                x={x + 0.8}
                y={y + 1.6}
              >
                {box.hint}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
