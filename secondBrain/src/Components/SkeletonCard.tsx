export function SkeletonCard() {
  return (
    <div className="animate-pulse max-w-84 w-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 bg-white/70 dark:bg-[#141620]/70 p-4 space-y-3.5 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
        <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
      </div>

      <div className="h-5 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />

      <div className="h-52 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl" />

      <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
      <div className="h-3 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded" />
    </div>
  );
}

