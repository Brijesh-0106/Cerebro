import { AiOutlineYoutube } from "react-icons/ai";
import { CiTwitter } from "react-icons/ci";
import { GiNotebook } from "react-icons/gi";
import { PiArticleNyTimesDuotone } from "react-icons/pi";
import { RiArrowRightUpFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import type { CardProps } from "../Models/CardProps";

export const CompactCard = ({
  courceNo,
  createdAt,
  description,
  _id,
  title,
  type,
}: CardProps) => {
  return (
    <div className="mb-4 break-inside-avoid flex max-w-64 flex-col rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#141620] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md dark:shadow-none p-3.5 transition-all">
      {/* Header */}
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-zinc-500">
          {type === "youtube" ? (
            <AiOutlineYoutube className="text-red-500" size={16} />
          ) : type === "tweet" ? (
            <CiTwitter className="text-[#1DA1F2]" size={16} />
          ) : type === "article" ? (
            <PiArticleNyTimesDuotone size={18} className="text-amber-500" />
          ) : (
            <GiNotebook size={16} className="text-indigo-600 dark:text-indigo-400" />
          )}
        </span>
        <span className="text-zinc-400 dark:text-zinc-500 text-xs">{createdAt}</span>
      </div>

      {/* Title */}
      <div className="text-zinc-900 dark:text-zinc-100 font-semibold text-sm mb-1 leading-snug">
        {title && (title.length > 22 ? title.slice(0, 22) + "..." : title)}
      </div>

      {/* Description */}
      <div className="text-zinc-500 dark:text-zinc-400 text-xs line-clamp-2 mb-2 leading-relaxed">
        {description}
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800/60 mt-auto">
        <span className="text-zinc-600 dark:text-zinc-400 text-xs font-medium">Source {courceNo}</span>
        <NavLink
          to={`/dashboard/all-content?highlight=${_id}`}
          title="Take Me to Origin"
          className="text-right flex items-center justify-end text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 gap-0.5"
        >
          View <RiArrowRightUpFill size={14} />
        </NavLink>
      </div>
    </div>
  );
};

