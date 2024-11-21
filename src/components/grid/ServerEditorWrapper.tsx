'use client';

import { updateProject } from '@/app/actions';
import { AppProject } from '@/types';
// import { EditorHeader } from '../editor/EditorHeader';
import { Editor } from './Editor';

export function ServerEditorWrapper({ project }: { project: AppProject }) {
  const handleProjectChange = async (updatedProject: AppProject) => {
    try {
      await updateProject(updatedProject.id, {
        name: updatedProject.name,
        boxes: updatedProject.boxes,
        cols: updatedProject.cols,
        font: updatedProject.font,
        rows: updatedProject.rows,
        hints: updatedProject.hints,
        isPublic: updatedProject.isPublic,
      });
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };
  console.log('project', project);

  return (
    <Editor
      initialProject={project}
      //   renderHeader={() => <EditorHeader project={project} />}
      onProjectChange={handleProjectChange}
    />
  );
}
