import { GiNotebook } from "react-icons/gi";
import type { ThoughtProps } from "../Models/CardProps";

export default function Thought({
  createdAt,
  imageUrl,
  description,
  title,
  type,
}: ThoughtProps) {
  return (
    <span className="mb-6 break-inside-avoid flex  max-w-84 flex-col rounded-xl border-2 gap-2 border-[#a9a9a9] p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="text-[#a9a9a9]">
          {type === "thought" && <GiNotebook size={24} color="#4f39f6" />}
        </span>
        <span className="text-[#a9a9a9] text-sm">{createdAt}</span>
      </div>

      {/* Title */}
      <div className="text-white font-semibold text-xl">{title}</div>

      {/* Media */}
      {type === "thought" && (
        <div className="h-65 flex items-center justify-center bg-[url(imageUrl)] overflow-hidden">
          <img src={imageUrl} className="h-full w-full object-cover" />
        </div>
      )}

      {/* Description */}
      <div className="text-[#a9a9a9] text-sm">{description}</div>
    </span>
  );
}
