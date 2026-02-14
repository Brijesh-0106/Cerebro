import { AiOutlineYoutube } from "react-icons/ai";
import { CiTwitter } from "react-icons/ci";
import { GiNotebook } from "react-icons/gi";
import { RiArrowRightUpFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import type { CardProps } from "../Models/CardProps";

export const CompactCard = ({
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
            ) : (
              <GiNotebook size={16} color="#E6D8F2" />
            )}
          </span>
          <span className="text-[#a9a9a9] text-xs">{createdAt}</span>
        </div>

        {/* Title */}
        <div className="text-white font-semibold text-sm">
          {title.length > 18 ? title.slice(0, 18) + "..." : title}
        </div>

        {/* Media */}
        {/* {type === "youtube" ? (
          <div className="relative h-30 overflow-hidden rounded-lg">
            {!imgLoaded && (
              <div className="absolute inset-0 bg-gray-800 overflow-hidden">
                <div
                  className="absolute inset-0 
                bg-[linear-gradient(110deg,#1f2937,45%,#374151,55%,#1f2937)] 
               bg-size-[200%_100%]
                animate-shimmer"
                />
              </div>
            )}
            <iframe
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="encrypted-media;"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              onLoad={() => setImgLoaded(true)}
              src={contentUrl}
            />
          </div>
        ) : type == "tweet" ? (
          <div className="h-45 flex items-center justify-center overflow-hidden">
            <div className="h-45 overflow-hidden flex justify-center items-start">
              <div className="w-45">
                <div className="scale-50 origin-top-left w-130">
                  <blockquote className="twitter-tweet">
                    <a href={contentUrl}></a>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        ) : (
          imageUrl && (
            <div className="relative h-45 overflow-hidden rounded-lg">
              {!imgLoaded && (
                <div className="absolute inset-0 bg-gray-800 overflow-hidden">
                  <div
                    className="absolute inset-0 
                bg-[linear-gradient(110deg,#1f2937,45%,#374151,55%,#1f2937)] 
                bg-bg-size-[200%_100%]
                animate-shimmer"
                  />
                </div>
              )}
              <img
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                src={imageUrl}
                className={`h-full w-full object-cover ${
                  imgLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImgLoaded(true)}
              />
            </div>
          )
        )} */}
        {/* Description */}
        <div className="text-[#a9a9a9] text-sm">
          {description.length > 42
            ? description.slice(0, 42) + "..."
            : description}
        </div>
        <NavLink
          to={`/dashboard/all-content?highlight=${_id}`}
          title="Take Me to Origin"
          className={
            "text-right flex items-center justify-end text-sm cursor-pointer text-blue-500"
          }
        >
          Take Me <RiArrowRightUpFill size={16} />
        </NavLink>
      </span>
    </>
  );
};
