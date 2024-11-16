import { Project } from '@/types';
import Link from 'next/link';
import { useCallback, useMemo } from 'react';
import { ProjectCardMenu } from './ProjectCardMenu';

type ProjectCardProps = {
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  project: Project;
};

export function ProjectCard({ onDelete, onRename, project }: ProjectCardProps) {
  // SVG constants
  const CELL_SIZE = 10;
  const STROKE_WIDTH = 0.5;
  const width = project.cols * CELL_SIZE;
  const height = project.rows * CELL_SIZE;

  // Add padding to SVG viewport
  const PADDING = CELL_SIZE / 2;
  const viewBox = `-${PADDING} -${PADDING} ${width + PADDING * 2} ${height + PADDING * 2}`;

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent navigation
      if (window.confirm('Are you sure you want to delete this project?')) {
        onDelete(project.id);
      }
    },
    [onDelete, project.id]
  );

  const handleRename = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent navigation
      const newName = window.prompt('Enter new name:', project.name);
      if (newName && newName !== project.name) {
        onRename(project.id, newName);
      }
    },
    [onRename, project.id, project.name]
  );

  const renderGrid = useMemo(() => {
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
  }, [project.boxes, height, viewBox, width, PADDING]);

  return (
    <Link
      className="group relative block rounded-lg border bg-white p-4 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
      href={`/editor/${project.id}`}
    >
      <div
        className="absolute right-2 top-2 z-10"
        onClick={(e) => e.preventDefault()} // Prevent navigation for the entire menu area
      >
        <ProjectCardMenu
          project={project}
          onDelete={() => onDelete(project.id)}
          onRename={() => onRename(project.id, project.name)}
        />
      </div>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">{renderGrid}</div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold group-hover:text-blue-600">
            {project.name}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Last updated: {new Date(project.updatedAt).toLocaleString()}
          </p>
          <div className="mt-2 text-sm text-gray-500">
            {project.rows}×{project.cols} grid • {project.hints.length} hints
          </div>
        </div>
      </div>
    </Link>
  );
}
