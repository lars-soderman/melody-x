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
  font: string;
  rows: number;
  version: number;
};

export interface Project {
  boxSize: number;
  boxes: Box[];
  cols: number;
  compressed?: boolean;
  createdAt: string;
  font: string;
  hints?: Hint[];
  id: string;
  modifiedAt: string;
  name: string;
  rows: number;
}

export type HintDirection = 'vertical' | 'horizontal';

export type Hint = {
  boxId: string;
  // Reference to the box where the hint starts
  direction: HintDirection;
  id: string;
  length: number;
  number: number;
  text: string;
};

export type HintState = {
  hints: Hint[];
  version: number;
};
