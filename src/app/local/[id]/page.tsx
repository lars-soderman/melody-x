'use client';

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
    <Editor
      initialProject={project}
      renderHeader={() => (
        <div className="flex items-center justify-between">
          <h1 className="text-l">Local project: {project.name}</h1>
        </div>
      )}
      onProjectChange={update}
    />
  );
}
