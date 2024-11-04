import { Project } from '@/types';
import { decodeProject, encodeProject } from './urlEncoding';

describe('URL Encoding', () => {
  const mockProject: Project = {
    id: 'test-id',
    name: 'Test Project',
    rows: 9,
    cols: 10,
    boxSize: 64,
    font: 'var(--font-default)',
    createdAt: '2024-03-20T12:00:00Z',
    modifiedAt: '2024-03-20T12:00:00Z',
    boxes: [
      { row: 0, col: 0, letter: 'H' },
      { row: 0, col: 1, letter: 'E' },
      { row: 0, col: 2, letter: 'J', black: true },
      { row: 1, col: 2, letter: 'A', arrow: 'down' },
      { row: 2, col: 3, letter: 'B', stop: 'right' },
      { row: 3, col: 4, letter: 'C', hint: 1 },
    ],
  };

  it('should encode and decode a project correctly', () => {
    const encoded = encodeProject(mockProject);
    const decoded = decodeProject(encoded);

    expect(decoded).not.toBeNull();
    if (!decoded) return;

    expect(decoded.rows).toBe(mockProject.rows);
    expect(decoded.cols).toBe(mockProject.cols);

    // Check each box property
    const findBox = (row: number, col: number) =>
      decoded.boxes.find((b) => b.row === row && b.col === col);

    const h = findBox(0, 0);
    expect(h?.letter).toBe('H');
    expect(h?.black).toBeUndefined();

    const j = findBox(0, 2);
    expect(j?.letter).toBe('J');
    expect(j?.black).toBe(true);

    const a = findBox(1, 2);
    expect(a?.letter).toBe('A');
    expect(a?.arrow).toBe('down');

    const b = findBox(2, 3);
    expect(b?.letter).toBe('B');
    expect(b?.stop).toBe('right');

    const c = findBox(3, 4);
    expect(c?.letter).toBe('C');
    expect(c?.hint).toBe(1);
  });

  it('should handle empty projects', () => {
    const emptyProject: Project = {
      ...mockProject,
      boxes: [],
    };

    const encoded = encodeProject(emptyProject);
    const decoded = decodeProject(encoded);

    expect(decoded).not.toBeNull();
    if (!decoded) return;

    expect(decoded.rows).toBe(emptyProject.rows);
    expect(decoded.cols).toBe(emptyProject.cols);
    expect(decoded.boxes).toHaveLength(0);
  });

  it('should handle invalid encoded strings', () => {
    expect(decodeProject('invalid')).toBeNull();
    expect(decodeProject('')).toBeNull();
    expect(decodeProject('xx-invalid')).toBeNull();
  });

  it('should produce compact strings', () => {
    const encoded = encodeProject(mockProject);
    expect(encoded.length).toBeLessThan(50); // Adjust based on actual implementation

    // Log the encoded string for manual inspection
    console.log('Encoded string:', encoded);
  });

  it('should handle all special characters in combination', () => {
    const complexProject: Project = {
      ...mockProject,
      boxes: [
        { row: 0, col: 0, letter: 'A', black: true, arrow: 'down', hint: 1 },
        { row: 1, col: 1, letter: 'B', arrow: 'right', stop: 'bottom' },
        { row: 2, col: 2, letter: 'C', stop: 'right', hint: 2 },
      ],
    };

    const encoded = encodeProject(complexProject);
    const decoded = decodeProject(encoded);

    expect(decoded).not.toBeNull();
    if (!decoded) return;

    const findBox = (row: number, col: number) =>
      decoded.boxes.find((b) => b.row === row && b.col === col);

    const a = findBox(0, 0);
    expect(a?.letter).toBe('A');
    expect(a?.black).toBe(true);
    expect(a?.arrow).toBe('down');
    expect(a?.hint).toBe(1);

    const b = findBox(1, 1);
    expect(b?.letter).toBe('B');
    expect(b?.arrow).toBe('right');
    expect(b?.stop).toBe('bottom');

    const c = findBox(2, 2);
    expect(c?.letter).toBe('C');
    expect(c?.stop).toBe('right');
    expect(c?.hint).toBe(2);
  });

  it('should handle large grid sizes', () => {
    const largeProject: Project = {
      ...mockProject,
      rows: 35,
      cols: 35,
      boxes: [
        { row: 34, col: 34, letter: 'Z' }, // Max base36 position
      ],
    };

    const encoded = encodeProject(largeProject);
    const decoded = decodeProject(encoded);

    expect(decoded).not.toBeNull();
    if (!decoded) return;

    expect(decoded.rows).toBe(35);
    expect(decoded.cols).toBe(35);

    const box = decoded.boxes.find((b) => b.row === 34 && b.col === 34);
    expect(box?.letter).toBe('Z');
  });

  it('should handle special characters in letters', () => {
    const specialCharsProject: Project = {
      ...mockProject,
      boxes: [
        { row: 0, col: 0, letter: 'Å' },
        { row: 0, col: 1, letter: 'Ä' },
        { row: 0, col: 2, letter: 'Ö' },
        { row: 1, col: 0, letter: 'É' },
      ],
    };

    const encoded = encodeProject(specialCharsProject);
    const decoded = decodeProject(encoded);

    expect(decoded).not.toBeNull();
    if (!decoded) return;

    const findBox = (row: number, col: number) =>
      decoded.boxes.find((b) => b.row === row && b.col === col);

    const a = findBox(0, 0);
    expect(a?.letter).toBe('Å');

    const ä = findBox(0, 1);
    expect(ä?.letter).toBe('Ä');

    const ö = findBox(0, 2);
    expect(ö?.letter).toBe('Ö');

    const é = findBox(1, 0);
    expect(é?.letter).toBe('É');
  });
});
