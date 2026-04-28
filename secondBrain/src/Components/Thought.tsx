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
    <span className="mb-6 break-inside-avoid flex flex-col rounded-xl border-2 gap-2 border-zinc-200 dark:border-[#a9a9a9] bg-white dark:bg-transparent shadow-sm dark:shadow-none p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="text-zinc-500 dark:text-[#a9a9a9]">
          {type === "thought" && <GiNotebook size={24} className="text-primary dark:text-[#E6D8F2]" />}
        </span>
        <span className="text-zinc-500 dark:text-[#a9a9a9] text-sm">{createdAt}</span>
      </div>

      {/* Title */}
      <div className="text-zinc-900 dark:text-white font-semibold text-xl">{title}</div>

      {/* Media */}
      {type === "thought" && imageUrl && (
        <div className="relative h-65 overflow-hidden">
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <div
                className="absolute inset-0 
                bg-[linear-gradient(110deg,#e5e7eb,45%,#f3f4f6,55%,#e5e7eb)] dark:bg-[linear-gradient(110deg,#1f2937,45%,#374151,55%,#1f2937)] 
                bg-bg-size-[200%_100%]
                animate-shimmer"
              />
            </div>
          )}

          <img
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            src={imageUrl}
            className={`h-full w-full rounded-lg object-cover ${
              imgLoaded ? "opacity-100 " : "opacity-0"
            }`}
            onLoad={() => setImgLoaded(true)}
          />
        </div>
      )}
      {/* Description */}
      <div className="text-zinc-600 dark:text-[#a9a9a9] text-sm">{description}</div>
    </span>
  );
}
