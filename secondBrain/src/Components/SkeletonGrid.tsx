import { SkeletonCard } from "./SkeletonCard";

export function SkeletonGrid() {
  return (
    <div className="ml-72 mt-13 px-5 pt-4 h-[calc(100vh-130px)]">
      <div className="columns-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
