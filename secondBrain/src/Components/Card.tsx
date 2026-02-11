import { useState } from "react";
import { AiOutlineYoutube } from "react-icons/ai";
import { CiTwitter } from "react-icons/ci";
import { GiNotebook } from "react-icons/gi";
import "react-loading-skeleton/dist/skeleton.css";
import type { CardProps } from "../Models/CardProps";

export const Card = ({
  createdAt,
  contentUrl,
  description,
  _id,
  imageUrl,
  title,
  type,
}: CardProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <span
      id={_id}
      className="mb-6 break-inside-avoid flex max-w-84 flex-col rounded-xl border-2 gap-2 border-[#a9a9a9] p-4"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="text-[#a9a9a9]">
          {type === "youtube" ? (
            <AiOutlineYoutube color="red" size={24} />
          ) : type === "tweet" ? (
            <CiTwitter color="#1DA1F2" size={24} />
          ) : (
            <GiNotebook size={24} color="#E6D8F2" />
          )}
        </span>
        <span className="text-[#a9a9a9] text-sm">{createdAt}</span>
      </div>

      {/* Title */}
      <div className="text-white font-semibold text-xl">{title}</div>

      {/* Media */}
      {type === "youtube" ? (
        <div className="relative h-65 overflow-hidden rounded-lg">
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
        <div className="h-65 flex items-center justify-center overflow-hidden">
          <div className="h-65 overflow-hidden flex justify-center items-start">
            <div className="w-65">
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
          <div className="relative h-65 overflow-hidden rounded-lg">
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
      )}
      <div />
      {/* Description */}
      <div className="text-[#a9a9a9] text-sm">{description}</div>
    </span>
  );
};
