import { Box } from '@/types';

export function isValidBoxData(box: unknown): box is Box {
  if (!box || typeof box !== 'object') return false;
  const b = box as Record<string, unknown>;

  return (
    typeof b.row === 'number' &&
    typeof b.col === 'number' &&
    (b.letter === null || typeof b.letter === 'string') &&
    (!('arrowDown' in b) || typeof b.arrowDown === 'boolean') &&
    (!('arrowRight' in b) || typeof b.arrowRight === 'boolean') &&
    (!('black' in b) || typeof b.black === 'boolean') &&
    (!('hint' in b) || typeof b.hint === 'number') &&
    (!('stopDown' in b) || typeof b.stopDown === 'boolean') &&
    (!('stopRight' in b) || typeof b.stopRight === 'boolean')
  );
}
