import { useEffect, useRef, useState } from "react";
import { AiOutlineYoutube } from "react-icons/ai";
import { CiTwitter } from "react-icons/ci";
import { GiNotebook } from "react-icons/gi";
import "react-loading-skeleton/dist/skeleton.css";
import type { CardProps } from "../Models/CardProps";
// Add at top of file or in a types.d.ts
declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement | null) => Promise<void>;
      };
    };
  }
}
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
  const [tweetLoaded, setTweetLoaded] = useState(false);
  const tweetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (type === "tweet" && tweetRef.current) {
      const loadTwitter = () => {
        if (window.twttr && window.twttr.widgets) {
          window.twttr.widgets.load(tweetRef.current).then(() => {
            // Observe when tweet iframe is added and loaded
            const observer = new MutationObserver(() => {
              const iframe = tweetRef.current?.querySelector("iframe");
              if (iframe) {
                iframe.onload = () => {
                  setTweetLoaded(true);
                  observer.disconnect();
                };
              }
            });

            observer.observe(tweetRef.current!, {
              childList: true,
              subtree: true,
            });

            // Fallback
            setTimeout(() => {
              setTweetLoaded(true);
              observer.disconnect();
            }, 5000);
          });
        }
      };

      if (window.twttr) {
        loadTwitter();
      } else {
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.onload = loadTwitter;
        document.body.appendChild(script);
      }
    }
  }, [type, contentUrl]);

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
            sandbox="allow-scripts allow-same-origin allow-presentation"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setImgLoaded(true)}
            src={contentUrl}
          />
        </div>
      ) : type == "tweet" ? (
        <div className="max-h-65 relative overflow-hidden rounded-lg">
          {!tweetLoaded && (
            <div className="absolute inset-0 bg-gray-800 overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(110deg,#1f2937,45%,#374151,55%,#1f2937)] bg-size-[200%_100%] animate-shimmer" />
            </div>
          )}
          <div
            ref={tweetRef}
            className={`max-h-65 overflow-hidden flex justify-center items-start ${
              tweetLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="w-65">
              <div className="scale-50 origin-top-left w-130">
                <blockquote className="twitter-tweet" data-dnt="true">
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
