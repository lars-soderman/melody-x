import { Box, Project } from '@/types';

export function compressProject(project: Project): Project {
  const strippedBoxes = project.boxes.filter(
    (box) =>
      box.letter ||
      box.black ||
      box.hint ||
      box.arrowDown ||
      box.arrowRight ||
      box.stop
  );

  return {
    ...project,
    boxes: strippedBoxes,
    compressed: true,
  };
}

export function decompressProject(project: Project): Project {
  if (!project.compressed) {
    // Ensure non-compressed projects also have correct box count
    const expectedLength = project.rows * project.cols;
    if (project.boxes.length !== expectedLength) {
      console.warn(
        `Project boxes length (${project.boxes.length}) does not match expected length (${expectedLength}). Fixing...`
      );
      const fullBoxes: Box[] = [];

      for (let row = 0; row < project.rows; row++) {
        for (let col = 0; col < project.cols; col++) {
          const existingBox = project.boxes.find(
            (box) => box?.row === row && box?.col === col
          );

          fullBoxes.push(
            existingBox ?? {
              row,
              col,
              letter: null,
            }
          );
        }
      }

      return {
        ...project,
        boxes: fullBoxes,
      };
    }
    return project;
  }

  // Handle compressed projects
  const compressedBoxes = project.boxes;
  const fullBoxes: Box[] = [];

  for (let row = 0; row < project.rows; row++) {
    for (let col = 0; col < project.cols; col++) {
      const existingBox = compressedBoxes.find(
        (box) => box.row === row && box.col === col
      );

      fullBoxes.push(
        existingBox ?? {
          row,
          col,
          letter: null,
        }
      );
    }
  }

  return {
    ...project,
    boxes: fullBoxes,
    compressed: false,
  };
}
