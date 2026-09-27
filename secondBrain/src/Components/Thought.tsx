import { useState } from "react";
import { GiNotebook } from "react-icons/gi";
import type { ThoughtProps } from "../Models/CardProps";

export default function Thought({
  createdAt,
  imageUrl,
  description,
  title,
  type,
}: ThoughtProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="group mb-5 break-inside-avoid flex flex-col rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#141620]/95 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] dark:shadow-none dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)] hover:-translate-y-1 transition-all duration-200 p-4.5">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400 border border-violet-100 dark:border-violet-900/30">
          {type === "thought" && <GiNotebook size={15} />}
          <span>Thought</span>
        </span>
        <span className="text-zinc-400 dark:text-zinc-500 text-xs font-medium">{createdAt}</span>
      </div>

      {/* Title */}
      <h4 className="text-zinc-900 dark:text-zinc-100 font-semibold text-base leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2.5">
        {title}
      </h4>

      {/* Media */}
      {type === "thought" && imageUrl && (
        <div className="relative h-56 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800/50 mb-3">
          {!imgLoaded && (
            <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          )}

          <img
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            src={imageUrl}
            className={`h-full w-full rounded-xl object-cover ${
              imgLoaded ? "opacity-100 " : "opacity-0"
            } transition-opacity duration-200`}
            onLoad={() => setImgLoaded(true)}
          />
        </div>
      )}
      {/* Description */}
      <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

