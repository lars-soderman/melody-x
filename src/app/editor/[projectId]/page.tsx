import { EditorHeader } from '@/components/editor/EditorHeader';
import { ServerEditorWrapper } from '@/components/grid/ServerEditorWrapper';
import { getUser } from '@/lib/auth';
import { mapProjectFromDB } from '@/lib/mappers';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';

// Mark as dynamic route
export const dynamic = 'force-dynamic';
// Disable static optimization
export const revalidate = 0;
// Disable static generation for this route
export const generateStaticParams = () => [];

// Add segment config
export const runtime = 'nodejs';
export const preferredRegion = 'auto';

export default async function EditorPage({
  params,
}: {
  params: { projectId: string };
}) {
  const user = await getUser();

  if (!user) {
    redirect('/');
  }

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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <EditorHeader project={project} />
      <ServerEditorWrapper project={project} />;
    </div>
  );
}
