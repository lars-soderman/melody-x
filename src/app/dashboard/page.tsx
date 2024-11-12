'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Welcome to Dashboard</h2>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p>Logged in as: {user?.email}</p>
      </div>

      {/* Test buttons */}
      <div className="flex gap-4">
        <button
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
          type="button"
          onClick={() => console.log('Create project clicked')}
        >
          Create Test Project
        </button>

        <button
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
          type="button"
          onClick={() => console.log('Current user:', user)}
        >
          Log User Info
        </button>
      </div>
    </div>
  );
}
