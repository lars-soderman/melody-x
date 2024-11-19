import { Editor } from '@/components/grid/Editor';
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
    redirect('/login');
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

  return <Editor project={project} />;
}
