import { Box, Project } from '@/types';

// Special characters for encoding
const SPECIAL_CHARS = {
  BLACK: '!',
  ARROW_RIGHT: '>',
  ARROW_DOWN: 'v',
  STOP_RIGHT: ']',
  STOP_BOTTOM: '_',
  HINT: '#',
  SEPARATOR: '§',
  META_SEPARATOR: '~',
} as const;

// Create a type for the special characters
type SpecialChar = (typeof SPECIAL_CHARS)[keyof typeof SPECIAL_CHARS];

// Create a Set of special characters for faster lookup
const SPECIAL_CHAR_SET = new Set(Object.values(SPECIAL_CHARS));

export function encodeProject(
  project: Project | null | undefined
): string | null {
  // Early return with warning for null/undefined
  if (!project) {
    console.warn('Cannot encode null or undefined project');
    return null;
  }

  // Validate required fields
  if (
    !project.id ||
    !project.name ||
    typeof project.rows !== 'number' ||
    typeof project.cols !== 'number'
  ) {
    console.warn('Project missing required fields');
    return null;
  }

  try {
    // Header: rows,cols in base36
    const header = `${project.rows.toString(36)}${project.cols.toString(36)}`;

    // Encode metadata with safe defaults for optional fields
    const metadata = [
      project.id.replace(/[§~]/g, '-'),
      project.name.replace(/[§~]/g, '-'),
      (project.boxSize ?? 64).toString(36),
      (project.font ?? 'var(--font-default)').replace(/[§~]/g, '-'),
      project.createdAt ?? new Date().toISOString(),
      project.modifiedAt ?? new Date().toISOString(),
    ]
      .map(encodeURIComponent)
      .join(SPECIAL_CHARS.META_SEPARATOR);

    // Safely handle boxes array
    const boxes = (project.boxes ?? [])
      .filter((b): b is NonNullable<Box> => b != null)
      .filter(
        (b) =>
          b.letter || b.black || b.arrowDown || b.arrowRight || b.stop || b.hint
      )
      .map((b) => {
        const pos = `${b.col.toString(36)}${b.row.toString(36)}`;
        const mods = [
          b.black ? SPECIAL_CHARS.BLACK : '',
          b.arrowRight ? SPECIAL_CHARS.ARROW_RIGHT : '',
          b.arrowDown ? SPECIAL_CHARS.ARROW_DOWN : '',
          b.stop === 'right' ? SPECIAL_CHARS.STOP_RIGHT : '',
          b.stop === 'bottom' ? SPECIAL_CHARS.STOP_BOTTOM : '',
          b.hint ? SPECIAL_CHARS.HINT + b.hint.toString(36) : '',
        ].join('');

        return `${pos}${b.letter || ''}${mods}`;
      })
      .join('');

    return `${header}${SPECIAL_CHARS.SEPARATOR}${metadata}${SPECIAL_CHARS.SEPARATOR}${boxes}`;
  } catch (e) {
    console.warn('Error encoding project:', e);
    return null;
  }
}

export function decodeProject(encoded: string): Project | null {
  // Basic validation
  if (!encoded || encoded.split(SPECIAL_CHARS.SEPARATOR).length !== 3) {
    console.warn('Invalid encoded project string');
    return null;
  }

  try {
    const [header, metadata, boxesStr] = encoded.split(SPECIAL_CHARS.SEPARATOR);

    // Validate header format
    if (!header || header.length !== 2 || !/^[0-9a-z]{2}$/i.test(header)) {
      console.warn('Invalid header format');
      return null;
    }

    // Parse header
    const rows = parseInt(header[0], 36);
    const cols = parseInt(header[1], 36);

    if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
      console.warn('Invalid grid dimensions');
      return null;
    }

    // Parse metadata
    const [id, name, boxSize, font, createdAt, modifiedAt] = metadata
      .split(SPECIAL_CHARS.META_SEPARATOR)
      .map(decodeURIComponent);

    const project: Project = {
      id: id || `imported-${Date.now()}`,
      name: name || 'Imported Project',
      rows,
      cols,
      boxSize: parseInt(boxSize, 36) || 64,
      font: font || 'var(--font-default)',
      createdAt,
      modifiedAt,
      boxes: [],
    };

    // Parse boxes
    if (!boxesStr) {
      return project;
    }

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
        throw new Error('Invalid position');
      }

      const col = parseInt(boxesStr[i], 36);
      const row = parseInt(boxesStr[i + 1], 36);
      i += 2;

      if (isNaN(row) || isNaN(col) || row >= rows || col >= cols) {
        throw new Error('Invalid position');
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
          case SPECIAL_CHARS.ARROW_RIGHT:
            box.arrowRight = true;
            break;
          case SPECIAL_CHARS.ARROW_DOWN:
            box.arrowDown = true;
            break;
          case SPECIAL_CHARS.STOP_RIGHT:
            box.stop = 'right';
            break;
          case SPECIAL_CHARS.STOP_BOTTOM:
            box.stop = 'bottom';
            break;
          case SPECIAL_CHARS.HINT:
            i++;
            if (i < boxesStr.length && /^[0-9a-z]$/i.test(boxesStr[i])) {
              box.hint = parseInt(boxesStr[i], 36);
            } else {
              throw new Error('Invalid hint');
            }
            break;
          default:
            throw new Error('Invalid special character');
        }
        i++;
      }

      boxes.push(box);
    }

    project.boxes = boxes;
    return project;
  } catch (e) {
    console.warn('Error decoding project:', e);
    return null;
  }
}

export const checkEqual = (project1: Project, project2: Project) => {
  const isEqual = JSON.stringify(project1) === JSON.stringify(project2);
  if (!isEqual) {
    console.error(
      'Project compression/decompression failed - projects are not equal'
    );

    // Log differences between projects
    const project1Keys = Object.keys(project1) as (keyof Project)[];
    project1Keys.forEach((key) => {
      if (JSON.stringify(project1[key]) !== JSON.stringify(project2[key])) {
        console.error(`Difference in ${key}:`);
        console.error('Project 1:', project1[key]);
        console.error('Project 2:', project2[key]);
      }
    });

    return false;
  }
  return true;
};

export function compressProject(
  project: Project | null | undefined
): Project | null {
  if (!project) {
    console.warn('Cannot compress null or undefined project');
    return null;
  }

  const strippedBoxes = (project.boxes ?? [])
    .filter((box): box is NonNullable<Box> => box != null)
    .filter(
      (box) => box.letter || box.black || box.hint || box.arrowDown || box.stop
    );

  return {
    id: project.id,
    name: project.name,
    rows: project.rows,
    cols: project.cols,
    boxSize: project.boxSize ?? 64,
    font: project.font ?? 'var(--font-default)',
    createdAt: project.createdAt ?? new Date().toISOString(),
    modifiedAt: project.modifiedAt ?? new Date().toISOString(),
    boxes: strippedBoxes,
    compressed: true,
  };
}
