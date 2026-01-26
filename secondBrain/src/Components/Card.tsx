import { AiOutlineYoutube } from "react-icons/ai";
import { CiTwitter } from "react-icons/ci";
import type { CardProps } from "../Models/CardProps";

export const Card = ({
  id,
  createdAt,
  contentUrl,
  description,
  title,
  type,
}: CardProps) => {
  return (
    <span className="mb-6 break-inside-avoid flex  max-w-84 flex-col rounded-xl border-2 gap-2 border-[#a9a9a9] p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="text-[#a9a9a9]">
          {type === "youtube" ? (
            <AiOutlineYoutube color="red" size={24} />
          ) : (
            <CiTwitter color="blue" size={24} />
          )}
        </span>
        <span className="text-[#a9a9a9] text-sm">Created on - {createdAt}</span>
      </div>

      {/* Title */}
      <div className="text-white font-semibold text-xl">{title}</div>

      {/* Media */}
      <div className="h-65 flex items-center justify-center overflow-hidden">
        {type === "youtube" ? (
          <iframe
            className="w-full h-full rounded-lg"
            src="https://www.youtube.com/embed/MJPdI1LlWmo"
            allowFullScreen
          />
        ) : (
          <div className="h-65 overflow-hidden flex justify-center items-start">
            <div className="w-65">
              <div className="scale-50 origin-top-left w-130">
                <blockquote className="twitter-tweet">
                  <a href="https://twitter.com/_rajtwt/status/2015051868859457622"></a>
                </blockquote>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="text-[#a9a9a9] text-sm">{description}</div>
    </span>
  );
};
