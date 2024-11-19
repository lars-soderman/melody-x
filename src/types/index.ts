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

export type AppProject = {
  boxes: Box[];
  collaborators?: ProjectCollaborator[];
  cols: number;
  createdAt: string;
  createdBy: string;
  font: string;
  hints: Hint[];
  id: string;
  isPublic?: boolean;
  is_shared?: boolean;
  name: string;
  owner_id: string;
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

export type ProjectCollaborator = {
  added_at: string;
  added_by: string;
  project_id: string;
  user?: {
    display_name?: string;
    email: string;
  };
  user_id: string;
};

export type ProjectAccess = 'owner' | 'collaborator' | 'none';
