export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
