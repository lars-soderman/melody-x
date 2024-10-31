export type Box = {
  arrow?: 'down' | 'right';
  black?: boolean;
  col: number;
  hint?: number;
  letter: string | null;
  row: number;
  stop?: 'bottom' | 'right';
};

export type GridState = {
  boxSize: number;
  boxes: Box[];
  cols: number;
  rows: number;
  version: number;
};
