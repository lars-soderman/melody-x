'use client';

import { LocalProjectsList } from '@/components/LocalProjectsList';

export default function LocalProjectsPage() {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Local Projects</h1>
        <a
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          href="/"
        >
          View Server Projects
        </a>
      </div>
      <LocalProjectsList />
    </div>
  );
}
