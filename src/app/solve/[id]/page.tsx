import { SolveEditor } from '@/components/solve/SolveEditor';
import { mapProjectFromDB } from '@/lib/mappers';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function SolvePage({
  params,
}: {
  params: { id: string };
}) {
  const project = await prisma.project.findUnique({
    where: {
      id: params.id,
      isPublic: true,
    },
    include: {
      owner: true,
    },
  });

  if (!project) {
    notFound();
  }

  // Remove letters from boxes for solving
  const solveProject = mapProjectFromDB(project);
  solveProject.boxes = solveProject.boxes.map((box) => ({
    ...box,
    letter: '',
  }));

  return (
    <div className="min-h-screen p-6">
      <h1 className="mb-6 text-2xl font-bold">{project.name}</h1>
      <SolveEditor project={solveProject} />
    </div>
  );
}
