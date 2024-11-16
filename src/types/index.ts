export type Box = {
  arrowDown?: boolean;
  arrowRight?: boolean;
  black?: boolean;
  col: number;
  hint?: number;
  letter: string | null;
  row: number;
  stopDown?: boolean;
  stopRight?: boolean;
};

export type GridState = {
  boxes: Box[];
  cols: number;
  font: string;
  hints: Hint[];
  rows: number;
  version: number;
};

export type Project = {
  boxes: Box[];
  cols: number;
  createdAt: string;
  createdBy: string;
  font: string;
  hints: Hint[];
  id: string;
  isPublic?: boolean;
  name: string;
  rows: number;
  updatedAt: string;
};

export type HintDirection = 'vertical' | 'horizontal';

export type Hint = {
  boxId: string;
  direction: HintDirection;
  id: string;
  length: number;
  number: number;
  text: string;
};

// export type HintState = {
//   hints: Hint[];
//   version: number;
// };
