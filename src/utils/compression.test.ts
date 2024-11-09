import { mockProject } from '@/test/mocks';
import { Project } from '@/types';
import { compressProject, decompressProject } from '@/utils/compression';

describe('Project Compression', () => {
  it('should compress by removing empty boxes', () => {
    const project: Project = {
      ...mockProject,
      boxes: [
        { row: 0, col: 0, letter: 'A' },
        { row: 0, col: 1, letter: null }, // Should be removed
        { row: 1, col: 0, letter: null }, // Should be removed
        { row: 1, col: 1, letter: 'B' },
      ],
    };

    const compressed = compressProject(project);
    expect(compressed.boxes).toHaveLength(2);
    expect(compressed.compressed).toBe(true);
  });

  it('should decompress by restoring empty boxes', () => {
    const compressed = compressProject(mockProject);
    const decompressed = decompressProject(compressed);

    expect(decompressed.boxes.length).toBe(mockProject.rows * mockProject.cols);
    expect(decompressed.compressed).toBe(false);
  });

  it('should preserve all box properties during compression/decompression', () => {
    const compressed = compressProject(mockProject);
    const decompressed = decompressProject(compressed);

    const blackBox = decompressed.boxes.find((b) => b.row === 1 && b.col === 1);
    expect(blackBox?.black).toBe(true);

    const arrowBox = decompressed.boxes.find((b) => b.row === 1 && b.col === 2);
    expect(arrowBox?.arrow).toBe('down');
  });

  it('should handle empty projects', () => {
    const emptyProject: Project = {
      ...mockProject,
      boxes: [],
    };

    const compressed = compressProject(emptyProject);
    const decompressed = decompressProject(compressed);

    expect(compressed.boxes).toHaveLength(0);
    expect(decompressed.boxes).toHaveLength(90);
  });

  it('should fill up boxes to match rows*cols even for non-compressed projects', () => {
    const incompleteProject: Project = {
      ...mockProject,
      compressed: false,
      rows: 3,
      cols: 4,
      boxes: [
        { row: 0, col: 0, letter: 'A' },
        { row: 1, col: 1, letter: 'B' },
      ],
    };

    const fixed = decompressProject(incompleteProject);

    // Should have 12 boxes (3 rows * 4 cols)
    expect(fixed.boxes).toHaveLength(12);

    // Original boxes should be preserved
    expect(fixed.boxes.find((b) => b.row === 0 && b.col === 0)?.letter).toBe(
      'A'
    );
    expect(fixed.boxes.find((b) => b.row === 1 && b.col === 1)?.letter).toBe(
      'B'
    );

    // Empty boxes should be added with null letters
    expect(fixed.boxes.filter((b) => b.letter === null)).toHaveLength(10);

    // Every box should have valid row/col coordinates
    fixed.boxes.forEach((box) => {
      expect(box.row).toBeLessThan(3);
      expect(box.col).toBeLessThan(4);
    });
  });
});
