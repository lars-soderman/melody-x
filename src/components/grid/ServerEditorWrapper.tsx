'use client';

import { updateProject } from '@/app/actions';
import { AppProject } from '@/types';
import { useState } from 'react';
import { Editor } from './Editor';

export function ServerEditorWrapper({
  project: initialProject,
}: {
  project: AppProject;
}) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleProjectChange = (updatedProject: AppProject) => {
    setIsSyncing(true);
    updateProject(updatedProject.id, {
      name: updatedProject.name,
      boxes: updatedProject.boxes,
      cols: updatedProject.cols,
      font: updatedProject.font,
      rows: updatedProject.rows,
      hints: updatedProject.hints,
      isPublic: updatedProject.isPublic,
    })
      .catch((error) => {
        console.error('Error saving project:', error);
      })
      .finally(() => {
        setIsSyncing(false);
      });
  };

  return (
    <Editor
      initialProject={initialProject}
      isSyncing={isSyncing}
      onProjectChange={handleProjectChange}
    />
  );
}
