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

  return (
    <svg
      className={`${className} bg-white`}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
    >
      {/* Grid background */}
      {Array.from({ length: rows }, (_, rowIndex) =>
        Array.from({ length: cols }, (_, colIndex) => {
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

      {/* Letters, arrows, and hints */}
      {boxes.map((box) => {
        if (box.row >= rows || box.col >= cols) return null;

        const x = box.col * cellSize + padding;
        const y = box.row * cellSize + padding;
        const centerX = x + cellSize / 2;
        const centerY = y + cellSize / 2;

        return (
          <g key={`${box.row}-${box.col}`}>
            {/* Letter */}
            {box.letter && !box.black && (
              <text
                dominantBaseline="middle"
                fill="black"
                fontSize={cellSize * 0.6}
                textAnchor="middle"
                x={centerX}
                y={centerY + cellSize * 0.1}
              >
                {box.letter}
              </text>
            )}

            {/* Hint number */}
            {box.hint && (
              <text
                dominantBaseline="hanging"
                fill={box.black ? 'white' : 'black'}
                fontSize={cellSize * 0.3}
                textAnchor="start"
                x={x + cellSize * 0.1}
                y={y + cellSize * 0.1}
              >
                {box.hint}
              </text>
            )}

            {/* Right arrow */}
            {box.arrowRight && (
              <path
                fill="none"
                stroke={box.black ? 'white' : 'black'}
                strokeWidth="0.3"
                d={`M ${x + cellSize * 0.3} ${y + cellSize * 0.5}
                    L ${x + cellSize * 0.7} ${y + cellSize * 0.5}
                    L ${x + cellSize * 0.6} ${y + cellSize * 0.3}
                    M ${x + cellSize * 0.7} ${y + cellSize * 0.5}
                    L ${x + cellSize * 0.6} ${y + cellSize * 0.7}`}
              />
            )}

            {/* Down arrow */}
            {box.arrowDown && (
              <path
                fill="none"
                stroke={box.black ? 'white' : 'black'}
                strokeWidth="0.3"
                d={`M ${x + cellSize * 0.5} ${y + cellSize * 0.3}
                    L ${x + cellSize * 0.5} ${y + cellSize * 0.7}
                    L ${x + cellSize * 0.3} ${y + cellSize * 0.6}
                    M ${x + cellSize * 0.5} ${y + cellSize * 0.7}
                    L ${x + cellSize * 0.7} ${y + cellSize * 0.6}`}
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
          </g>
        );
      })}
    </svg>
  );
}
