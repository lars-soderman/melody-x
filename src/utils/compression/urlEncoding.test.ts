// import { mockProject } from '@/test/mocks';
// import { Box, Project } from '@/types';
// import {
//   compressProject,
//   decodeProject,
//   encodeProject,
// } from '@/utils/urlEncoding';

// describe('URL Encoding', () => {
//   it('should encode and decode a project correctly', () => {
//     const encoded = encodeProject(mockProject);
//     const decoded = decodeProject(encoded ?? '');

//     expect(decoded).not.toBeNull();
//     if (!decoded) return;

//     // Should preserve project structure
//     expect(decoded.rows).toBe(mockProject.rows);
//     expect(decoded.cols).toBe(mockProject.cols);
//     expect(decoded.boxes).toHaveLength(mockProject.boxes.length);

//     // Should preserve box properties
//     const findBox = (row: number, col: number) =>
//       decoded.boxes.find((b) => b.row === row && b.col === col);

//     const h = findBox(0, 0);
//     expect(h?.letter).toBe('H');
//     expect(h?.black).toBeUndefined();

//     const j = findBox(0, 2);
//     expect(j?.letter).toBe('J');
//     expect(j?.black).toBe(true);
//   });

//   it('should handle empty projects', () => {
//     const emptyProject: Project = {
//       ...mockProject,
//       boxes: [],
//     };

//     const encoded = encodeProject(emptyProject);
//     const decoded = decodeProject(encoded ?? '');

//     expect(decoded).not.toBeNull();
//     if (!decoded) return;

//     expect(decoded.rows).toBe(emptyProject.rows);
//     expect(decoded.cols).toBe(emptyProject.cols);
//     expect(decoded.boxes).toHaveLength(0);
//   });

//   it('should handle invalid encoded strings', () => {
//     expect(decodeProject('invalid')).toBeNull();
//     expect(decodeProject('')).toBeNull();
//     expect(decodeProject('xx-invalid')).toBeNull();
//   });

//   it('should produce compact strings', () => {
//     const encoded = encodeProject(mockProject);
//     expect(encoded?.length).toBeLessThan(500); // Adjust based on actual implementation

//     // Log the encoded string for manual inspection
//     console.log('Encoded string:', encoded);
//   });

//   it('should handle all special characters in combination', () => {
//     const complexProject: Project = {
//       ...mockProject,
//       boxes: [
//         { row: 0, col: 0, letter: 'A', black: true, arrowDown: true, hint: 1 },
//         { row: 1, col: 1, letter: 'B', arrowRight: true, stop: 'bottom' },
//         { row: 2, col: 2, letter: 'C', stop: 'right', hint: 2 },
//       ],
//     };

//     const encoded = encodeProject(complexProject);
//     const decoded = decodeProject(encoded ?? '');

//     expect(decoded).not.toBeNull();
//     if (!decoded) return;

//     const findBox = (row: number, col: number) =>
//       decoded.boxes.find((b) => b.row === row && b.col === col);

//     const a = findBox(0, 0);
//     expect(a?.letter).toBe('A');
//     expect(a?.black).toBe(true);
//     expect(a?.arrowDown).toBe(true);
//     expect(a?.hint).toBe(1);

//     const b = findBox(1, 1);
//     expect(b?.letter).toBe('B');
//     expect(b?.arrowRight).toBe(true);
//     expect(b?.stop).toBe('bottom');

//     const c = findBox(2, 2);
//     expect(c?.letter).toBe('C');
//     expect(c?.stop).toBe('right');
//     expect(c?.hint).toBe(2);
//   });

//   it('should handle large grid sizes', () => {
//     const largeProject: Project = {
//       ...mockProject,
//       rows: 35,
//       cols: 35,
//       boxes: [
//         { row: 34, col: 34, letter: 'Z' }, // Max base36 position
//       ],
//     };

//     const encoded = encodeProject(largeProject);
//     const decoded = decodeProject(encoded ?? '');

//     expect(decoded).not.toBeNull();
//     if (!decoded) return;

//     expect(decoded.rows).toBe(35);
//     expect(decoded.cols).toBe(35);

//     const box = decoded.boxes.find((b) => b.row === 34 && b.col === 34);
//     expect(box?.letter).toBe('Z');
//   });

//   it('should handle special characters in letters', () => {
//     const specialCharsProject: Project = {
//       ...mockProject,
//       boxes: [
//         { row: 0, col: 0, letter: 'Å' },
//         { row: 0, col: 1, letter: 'Ä' },
//         { row: 0, col: 2, letter: 'Ö' },
//         { row: 1, col: 0, letter: 'É' },
//       ],
//     };

//     const encoded = encodeProject(specialCharsProject);
//     const decoded = decodeProject(encoded ?? '');

//     expect(decoded).not.toBeNull();
//     if (!decoded) return;

//     const findBox = (row: number, col: number) =>
//       decoded.boxes.find((b) => b.row === row && b.col === col);

//     const a = findBox(0, 0);
//     expect(a?.letter).toBe('Å');

//     const ä = findBox(0, 1);
//     expect(ä?.letter).toBe('Ä');

//     const ö = findBox(0, 2);
//     expect(ö?.letter).toBe('Ö');

//     const é = findBox(1, 0);
//     expect(é?.letter).toBe('É');
//   });
// });

// describe('Project Encoding', () => {
//   it('should handle null/undefined project', () => {
//     const consoleSpy = jest.spyOn(console, 'warn');

//     expect(encodeProject(null)).toBeNull();
//     expect(consoleSpy).toHaveBeenCalledWith(
//       'Cannot encode null or undefined project'
//     );

//     expect(encodeProject(undefined)).toBeNull();
//     expect(consoleSpy).toHaveBeenCalledWith(
//       'Cannot encode null or undefined project'
//     );

//     consoleSpy.mockRestore();
//   });

//   it('should handle missing required fields', () => {
//     const consoleSpy = jest.spyOn(console, 'warn');
//     const invalidProject = {
//       boxes: [],
//     } as unknown as Project;

//     expect(encodeProject(invalidProject)).toBeNull();
//     expect(consoleSpy).toHaveBeenCalledWith('Project missing required fields');

//     consoleSpy.mockRestore();
//   });

//   it('should handle null/undefined boxes', () => {
//     const projectWithNullBoxes: Project = {
//       id: 'test',
//       name: 'Test',
//       rows: 9,
//       cols: 10,
//       boxes: [
//         { row: 0, col: 0, letter: 'A' },
//         null as unknown as Box,
//         { row: 1, col: 1, letter: 'B' },
//       ],
//       boxSize: 64,
//       font: 'var(--font-default)',
//       createdAt: '2024-03-20T12:00:00Z',
//       updatedAt: '2024-03-20T12:00:00Z',
//     };

//     const encoded = encodeProject(projectWithNullBoxes);
//     const decoded = decodeProject(encoded ?? '');

//     expect(decoded).not.toBeNull();
//     if (!decoded) return;

//     // Should only include valid boxes
//     expect(decoded.boxes).toHaveLength(2);
//     expect(decoded.boxes[0].letter).toBe('A');
//     expect(decoded.boxes[1].letter).toBe('B');
//   });

//   it('should handle missing optional fields', () => {
//     const minimalProject: Project = {
//       id: 'test',
//       name: 'Test',
//       rows: 9,
//       cols: 10,
//       boxes: [{ row: 0, col: 0, letter: 'A' }],
//     } as Project;

//     const encoded = encodeProject(minimalProject);
//     const decoded = decodeProject(encoded ?? '');

//     expect(decoded).not.toBeNull();
//     if (!decoded) return;

//     // Should use defaults for missing fields
//     expect(decoded.boxSize).toBe(64);
//     expect(decoded.font).toBe('var(--font-default)');
//     expect(decoded.createdAt).toBeTruthy();
//     expect(decoded.updatedAt).toBeTruthy();
//   });
// });

// describe('Project Compression', () => {
//   it('should handle null/undefined project', () => {
//     const consoleSpy = jest.spyOn(console, 'warn');
//     expect(compressProject(null)).toBeNull();
//     expect(consoleSpy).toHaveBeenCalledWith(
//       'Cannot compress null or undefined project'
//     );
//     expect(compressProject(undefined)).toBeNull();
//     expect(consoleSpy).toHaveBeenCalledWith(
//       'Cannot compress null or undefined project'
//     );
//     consoleSpy.mockRestore();
//   });

//   it('should handle null boxes in compression', () => {
//     const projectWithNullBoxes: Project = {
//       id: 'test',
//       name: 'Test',
//       rows: 9,
//       cols: 10,
//       boxes: [
//         { row: 0, col: 0, letter: 'A' },
//         null as unknown as Box,
//         { row: 1, col: 1, letter: null },
//       ],
//       boxSize: 64,
//       font: 'var(--font-default)',
//       createdAt: '2024-03-20T12:00:00Z',
//       updatedAt: '2024-03-20T12:00:00Z',
//     };

//     const compressed = compressProject(projectWithNullBoxes);

//     // Should only include non-null boxes with content
//     expect(compressed?.boxes).toHaveLength(1);
//     expect(compressed?.boxes[0].letter).toBe('A');
//   });
// });
