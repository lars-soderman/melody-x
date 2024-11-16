import { supabase } from '@/lib/supabase';
import { Box, Hint, HintDirection, Project } from '@/types';
import { Database } from '@/types/supabase';

type DbProject = Database['public']['Tables']['projects']['Row'];
type DbHint = {
  boxId: string;
  direction: string;
  id: string;
  length: number;
  number: number;
  text: string;
};

type DbBox = {
  arrowDown?: boolean;
  arrowRight?: boolean;
  black?: boolean;
  col: number;
  hint?: number;
  letter: string;
  row: number;
  stopDown?: boolean;
  stopRight?: boolean;
};

function dbToAppProject(dbProject: DbProject): Project {
  const gridData = dbProject.grid_data as Record<string, unknown>;

  // Parse and validate boxes from JSON
  const boxes = (gridData.boxes as DbBox[]).map(
    (box): Box => ({
      row: box.row,
      col: box.col,
      letter: box.letter,
      arrowDown: box.arrowDown || false,
      arrowRight: box.arrowRight || false,
      black: box.black || false,
      hint: box.hint || undefined,
      stopDown: box.stopDown || false,
      stopRight: box.stopRight || false,
    })
  );

  // Parse and validate hints from JSON, ensuring numbers are valid
  const hints = ((dbProject.hints as DbHint[]) || [])
    .map(
      (hint): Hint => ({
        boxId: hint.boxId,
        direction: hint.direction as HintDirection,
        id: hint.id,
        length: hint.length,
        number:
          typeof hint.number === 'number' && hint.number > 0 ? hint.number : 1,
        text: hint.text,
      })
    )
    .sort((a, b) => a.number - b.number); // Sort by number to ensure sequential ordering

  return {
    id: dbProject.id,
    name: dbProject.name,
    createdAt: dbProject.created_at,
    updatedAt: dbProject.updated_at,
    createdBy: dbProject.created_by,
    boxes,
    cols: Number(gridData.cols),
    rows: Number(gridData.rows),
    font: String(gridData.font),
    hints,
  };
}

export async function getProjectDB(id: string): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .select()
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    throw error;
  }

  return dbToAppProject(data);
}

export async function getProjectsDB(): Promise<Project[]> {
  const { data, error } = await supabase.from('projects').select();

  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }

  return data.map(dbToAppProject);
}

export async function createProjectDB(project: Project): Promise<Project> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const userId = userData.user.id;

  const { data, error } = await supabase
    .from('projects')
    .insert({
      name: project.name,
      grid_data: {
        boxes: project.boxes,
        cols: project.cols,
        rows: project.rows,
        font: project.font,
      },
      hints: project.hints,
      user_id: userId,
      is_public: project.isPublic ?? false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    throw error;
  }

  return dbToAppProject(data);
}

export async function updateProjectDB(
  id: string,
  project: Partial<Project>
): Promise<Project> {
  const dbProject = {
    grid_data: project.boxes
      ? {
          boxes: project.boxes,
          cols: project.cols,
          rows: project.rows,
          font: project.font,
        }
      : undefined,
    name: project.name,
    hints: project.hints,
    updated_at: new Date().toISOString(),
    is_public: project.isPublic,
  };

  // Remove undefined fields to avoid nulling them in the database
  const cleanDbProject = Object.fromEntries(
    Object.entries(dbProject).filter(([_, v]) => v !== undefined)
  );

  const { data, error } = await supabase
    .from('projects')
    .update(cleanDbProject)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    throw error;
  }

  return dbToAppProject(data);
}

export async function deleteProjectDB(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}
