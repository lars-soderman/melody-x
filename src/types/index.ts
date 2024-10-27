export type Box = {
  letter: string | null;
  row: number;
  col: number;
  arrow?: 'down' | 'right';
  stop?: 'bottom' | 'right';
  black?: boolean;
  hint?: number;
};
