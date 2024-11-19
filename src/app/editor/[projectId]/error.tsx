'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-bold">Something went wrong!</h2>
      <button
        className="rounded bg-blue-500 px-4 py-2 text-white"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
