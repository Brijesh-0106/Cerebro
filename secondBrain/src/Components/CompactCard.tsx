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
  // const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <>
      <span className="mb-6 break-inside-avoid flex max-w-60 flex-col rounded-xl border-2 gap-1 py-2 border-[#a9a9a9] px-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <span className="text-[#a9a9a9]">
            {type === "youtube" ? (
              <AiOutlineYoutube color="red" size={16} />
            ) : type === "tweet" ? (
              <CiTwitter color="#1DA1F2" size={16} />
            ) : type === "article" ? (
              <PiArticleNyTimesDuotone size={24} color="#F59E0B" />
            ) : (
              <GiNotebook size={16} color="#E6D8F2" />
            )}
          </span>
          <span className="text-[#a9a9a9] text-xs">{createdAt}</span>
        </div>

        {/* Title */}
        <div className="text-white font-semibold text-sm">
          {title && (title.length > 18 ? title.slice(0, 18) + "..." : title)}
        </div>

        {/* Description */}
        <div className="text-[#a9a9a9] text-sm">
          {description.length > 42
            ? description.slice(0, 42) + "..."
            : description}
        </div>
        <div className="flex justify-between">
          <span className="text-white text-sm">Source {courceNo}</span>
          <NavLink
            to={`/dashboard/all-content?highlight=${_id}`}
            title="Take Me to Origin"
            className={
              "text-right flex items-center justify-end text-sm cursor-pointer text-blue-500"
            }
          >
            Take Me <RiArrowRightUpFill size={16} />
          </NavLink>
        </div>
      </span>
    </>
  );
};
