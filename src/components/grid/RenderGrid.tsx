import { AppProject } from '@/types';

const CELL_SIZE = 10;
const STROKE_WIDTH = 0.5;

export const RenderGrid = ({ project }: { project: AppProject }) => {
  const width = project.cols * CELL_SIZE;
  const height = project.rows * CELL_SIZE;

  // Add padding to SVG viewport
  const PADDING = CELL_SIZE / 2;
  const viewBox = `-${PADDING} -${PADDING} ${width + PADDING * 2} ${height + PADDING * 2}`;

  // Create a Set of existing box positions to check for duplicates
  const boxPositions = new Set(
    project.boxes.map((box) => `${box.row}-${box.col}`)
  );

  const cells = project.boxes
    // Filter out any duplicate positions
    .filter((box) => {
      const key = `${box.row}-${box.col}`;
      if (boxPositions.has(key)) {
        boxPositions.delete(key); // Remove so we only keep the first instance
        return true;
      }
      return false;
    })
    .map((box) => {
      const x = box.col * CELL_SIZE;
      const y = box.row * CELL_SIZE;

      return (
        <g key={`cell-${box.row}-${box.col}`}>
          {/* Cell background */}
          <rect
            fill={box.black ? 'black' : 'white'}
            height={CELL_SIZE}
            stroke="#ccc"
            strokeWidth={STROKE_WIDTH}
            width={CELL_SIZE}
            x={x}
            y={y}
          />

          {/* Arrows */}
          {box.arrowRight && (
            <path
              fill="none"
              stroke={box.black ? 'white' : 'black'}
              strokeWidth={STROKE_WIDTH}
              d={`M ${x + CELL_SIZE * 0.3} ${y + CELL_SIZE * 0.5}
                    L ${x + CELL_SIZE * 0.7} ${y + CELL_SIZE * 0.5}
                    L ${x + CELL_SIZE * 0.6} ${y + CELL_SIZE * 0.3}
                    M ${x + CELL_SIZE * 0.7} ${y + CELL_SIZE * 0.5}
                    L ${x + CELL_SIZE * 0.6} ${y + CELL_SIZE * 0.7}`}
            />
          )}
          {box.arrowDown && (
            <path
              fill="none"
              stroke={box.black ? 'white' : 'black'}
              strokeWidth={STROKE_WIDTH}
              d={`M ${x + CELL_SIZE * 0.5} ${y + CELL_SIZE * 0.3}
                    L ${x + CELL_SIZE * 0.5} ${y + CELL_SIZE * 0.7}
                    L ${x + CELL_SIZE * 0.3} ${y + CELL_SIZE * 0.6}
                    M ${x + CELL_SIZE * 0.5} ${y + CELL_SIZE * 0.7}
                    L ${x + CELL_SIZE * 0.7} ${y + CELL_SIZE * 0.6}`}
            />
          )}

          {/* Optional: Show letters in a light gray */}
          {box.letter && !box.black && (
            <text
              fill="#999"
              fontFamily="monospace"
              fontSize={CELL_SIZE * 0.6}
              textAnchor="middle"
              x={x + CELL_SIZE * 0.5}
              y={y + CELL_SIZE * 0.7}
            >
              {box.letter}
            </text>
          )}

          {/* Hint numbers */}
          {box.hint && (
            <text
              fill={box.black ? 'white' : '#666'}
              fontFamily="monospace"
              fontSize={CELL_SIZE * 0.3}
              x={x + CELL_SIZE * 0.2}
              y={y + CELL_SIZE * 0.3}
            >
              {box.hint}
            </text>
          )}
        </g>
      );
    });

  return (
    <svg
      className="overflow-visible"
      height={height}
      viewBox={viewBox}
      width={width}
    >
      {/* Optional: Add grid background */}
      <rect
        className="shadow-sm"
        fill="white"
        height={height + PADDING * 2}
        rx={2}
        width={width + PADDING * 2}
        x={-PADDING}
        y={-PADDING}
      />

      {/* Grid cells */}
      {cells}
    </svg>
  );
};
