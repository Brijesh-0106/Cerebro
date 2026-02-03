export function SkeletonCard() {
  return (
    <div className="animate-pulse max-w-84 rounded-xl border border-gray-700 p-4 space-y-3">
      <div className="flex justify-between">
        <div className="h-4 w-24 bg-gray-700 rounded" />
        <div className="h-3 w-16 bg-gray-700 rounded" />
      </div>

      <div className="h-4 w-3/4 bg-gray-700 rounded" />

      <div className="h-65 bg-gray-800 rounded-lg" />

      <div className="h-3 w-full bg-gray-700 rounded" />
      <div className="h-3 w-5/6 bg-gray-700 rounded" />
    </div>
  );
}
