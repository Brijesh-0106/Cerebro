import { useState } from "react";
import { GiNotebook } from "react-icons/gi";
import "react-loading-skeleton/dist/skeleton.css";

import type { ThoughtProps } from "../Models/CardProps";

export default function Thought({
  createdAt,
  imageUrl,
  description,
  title,
  type,
}: ThoughtProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  console.log(imgLoaded);

  return (
    <span className="mb-6 break-inside-avoid flex flex-col rounded-xl border-2 gap-2 border-[#a9a9a9] p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="text-[#a9a9a9]">
          {type === "thought" && <GiNotebook size={24} color="#8B5CF6" />}
        </span>
        <span className="text-[#a9a9a9] text-sm">{createdAt}</span>
      </div>

      {/* Title */}
      <div className="text-white font-semibold text-xl">{title}</div>

      {/* Media */}
      {type === "thought" && imageUrl && (
        <div className="relative h-65 overflow-hidden">
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gray-800 overflow-hidden">
              <div
                className="absolute inset-0 
                bg-[linear-gradient(110deg,#1f2937,45%,#374151,55%,#1f2937)] 
                bg-[length:200%_100%] 
                animate-shimmer"
              />
            </div>
          )}

          <img
            src={imageUrl}
            className={`h-full w-full object-cover ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImgLoaded(true)}
          />
        </div>
      )}
      {/* Description */}
      <div className="text-[#a9a9a9] text-sm">{description}</div>
    </span>
  );
}
