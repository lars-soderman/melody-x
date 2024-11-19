import { Editor } from '@/components/grid/Editor';
import { mapProjectFromDB } from '@/lib/mappers';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditorPage({
  params,
}: {
  params: { projectId: string };
}) {
  console.log('===  page.tsx [10] ===');
  const prismaProject = await prisma.project.findUnique({
    where: { id: params.projectId },
    include: {
      owner: true,
      collaborators: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!prismaProject) {
    notFound();
  }

  const project = mapProjectFromDB(prismaProject);

  return <Editor project={project} />;
}
