'use client';

import { EditorHeader } from '@/components/editor/EditorHeader';
import { Editor } from '@/components/grid/Editor';
import { useLocalProjects } from '@/hooks/useLocalProjects';
import { useParams } from 'next/navigation';

export default function LocalProjectPage() {
  const { projects, update } = useLocalProjects();
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <EditorHeader isLocalProject project={project} />
      <Editor initialProject={project} onProjectChange={update} />
    </div>
  );
}
