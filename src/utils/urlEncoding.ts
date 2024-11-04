import { createDefaultProject } from '@/constants';
import { Box, Project } from '@/types';

// Special characters for encoding
const SPECIAL_CHARS = {
  BLACK: '.',
  ARROW_DOWN: 'v',
  ARROW_RIGHT: '>',
  STOP_BOTTOM: '_',
  STOP_RIGHT: '|',
  HINT: '#',
  SEPARATOR: '-',
} as const;

// Create a type for the special characters
type SpecialChar = (typeof SPECIAL_CHARS)[keyof typeof SPECIAL_CHARS];

// Create a Set of special characters for faster lookup
const SPECIAL_CHAR_SET = new Set(Object.values(SPECIAL_CHARS));

export function encodeProject(project: Project): string {
  // Header: rows,cols in base36
  const header = `${project.rows.toString(36)}${project.cols.toString(36)}`;

  // Encode boxes with content
  const boxes = project.boxes
    .filter((b) => b.letter || b.black || b.arrow || b.stop || b.hint)
    .map((b) => {
      // Position: 2 chars (col,row in base36)
      const pos = `${b.col.toString(36)}${b.row.toString(36)}`;

      // Modifiers
      const mods = [
        b.black ? SPECIAL_CHARS.BLACK : '',
        b.arrow === 'down' ? SPECIAL_CHARS.ARROW_DOWN : '',
        b.arrow === 'right' ? SPECIAL_CHARS.ARROW_RIGHT : '',
        b.stop === 'bottom' ? SPECIAL_CHARS.STOP_BOTTOM : '',
        b.stop === 'right' ? SPECIAL_CHARS.STOP_RIGHT : '',
        b.hint ? SPECIAL_CHARS.HINT + b.hint.toString(36) : '',
      ].join('');

      return `${pos}${b.letter || ''}${mods}`;
    })
    .join('');

  return `${header}${SPECIAL_CHARS.SEPARATOR}${boxes}`;
}

export function decodeProject(encoded: string): Project | null {
  try {
    // Basic validation
    if (!encoded || !encoded.includes(SPECIAL_CHARS.SEPARATOR)) {
      return null;
    }

    const [header, boxesStr] = encoded.split(SPECIAL_CHARS.SEPARATOR);

    // Validate header format (must be exactly 2 base36 digits)
    if (!header || header.length !== 2 || !/^[0-9a-z]{2}$/i.test(header)) {
      return null;
    }

    // Parse header
    const rows = parseInt(header[0], 36);
    const cols = parseInt(header[1], 36);

    if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
      return null;
    }

    const project = createDefaultProject('Imported Puzzle');
    project.rows = rows;
    project.cols = cols;

    // Validate boxes string
    if (!boxesStr || boxesStr.length === 0) {
      project.boxes = [];
      return project;
    }

    // Parse boxes
    const boxes: Box[] = [];
    let i = 0;

    while (i < boxesStr.length) {
      // Each box must start with 2 base36 digits for position
      if (
        i + 1 >= boxesStr.length ||
        !/^[0-9a-z]{2}/i.test(boxesStr.slice(i))
      ) {
        return null;
      }

      const col = parseInt(boxesStr[i], 36);
      const row = parseInt(boxesStr[i + 1], 36);
      i += 2;

      if (isNaN(row) || isNaN(col) || row >= rows || col >= cols) {
        return null;
      }

      const box: Box = { row, col, letter: null };

      // Parse letter if present
      if (
        i < boxesStr.length &&
        !SPECIAL_CHAR_SET.has(boxesStr[i] as SpecialChar)
      ) {
        box.letter = boxesStr[i];
        i++;
      }

      // Parse special characters
      while (
        i < boxesStr.length &&
        SPECIAL_CHAR_SET.has(boxesStr[i] as SpecialChar)
      ) {
        const char = boxesStr[i];

        switch (char) {
          case SPECIAL_CHARS.BLACK:
            box.black = true;
            break;
          case SPECIAL_CHARS.ARROW_DOWN:
            box.arrow = 'down';
            break;
          case SPECIAL_CHARS.ARROW_RIGHT:
            box.arrow = 'right';
            break;
          case SPECIAL_CHARS.STOP_BOTTOM:
            box.stop = 'bottom';
            break;
          case SPECIAL_CHARS.STOP_RIGHT:
            box.stop = 'right';
            break;
          case SPECIAL_CHARS.HINT:
            i++;
            if (i < boxesStr.length && /^[0-9a-z]$/i.test(boxesStr[i])) {
              box.hint = parseInt(boxesStr[i], 36);
            } else {
              return null;
            }
            break;
          default:
            return null;
        }
        i++;
      }

      boxes.push(box);
    }

    project.boxes = boxes;
    return project;
  } catch (e) {
    console.error('Error decoding project:', e);
    return null;
  }
}

// Example usage:
/*
const project = {
  rows: 9,
  cols: 10,
  boxes: [
    { row: 0, col: 0, letter: 'H' },
    { row: 0, col: 1, letter: 'E' },
    { row: 0, col: 2, letter: 'J', black: true },
    { row: 1, col: 2, letter: 'A', arrow: 'down' },
  ]
};

// Encodes to something like: "9a-00H01E02J.12Av"
const encoded = encodeProject(project);
const decoded = decodeProject(encoded);
*/
