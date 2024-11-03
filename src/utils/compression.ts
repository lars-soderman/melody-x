import { Box, Project } from '@/types';

export function compressProject(project: Project): Project {
  const strippedBoxes = project.boxes.filter(
    (box) => box.letter || box.black || box.hint || box.arrow || box.stop
  );

  return {
    ...project,
    boxes: strippedBoxes,
    compressed: true,
  };
}

export function decompressProject(project: Project): Project {
  if (!project.compressed) return project;

  const compressedBoxes = project.boxes;
  const fullBoxes: Box[] = [];

  for (let row = 0; row < project.rows; row++) {
    for (let col = 0; col < project.cols; col++) {
      const existingBox = compressedBoxes.find(
        (box) => box.row === row && box.col === col
      );

      if (existingBox) {
        fullBoxes.push(existingBox);
      } else {
        fullBoxes.push({
          row,
          col,
          letter: null,
        });
      }
    }
  }

  return {
    ...project,
    boxes: fullBoxes,
    compressed: false,
  };
}
