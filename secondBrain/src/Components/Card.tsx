import { useEffect, useRef, useState } from "react";
import { AiOutlineYoutube } from "react-icons/ai";
import { CiTwitter } from "react-icons/ci";
import { GiNotebook } from "react-icons/gi";
import { PiArticleNyTimesDuotone } from "react-icons/pi";
import { RiArrowRightUpFill } from "react-icons/ri";
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
  author,
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
    <div
      id={_id}
      className="group relative mb-5 mx-auto w-full break-inside-avoid flex flex-col rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4.5 bg-white dark:bg-[#141620]/95 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] dark:shadow-none dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)] hover:-translate-y-1 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        {type === "youtube" ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-100 dark:border-red-900/30">
            <AiOutlineYoutube size={16} />
            <span>YouTube</span>
          </span>
        ) : type === "tweet" ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30">
            <CiTwitter size={16} />
            <span>Twitter</span>
          </span>
        ) : type === "article" ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
            <PiArticleNyTimesDuotone size={16} />
            <span>Article</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400 border border-violet-100 dark:border-violet-900/30">
            <GiNotebook size={15} />
            <span>Thought</span>
          </span>
        )}

        <span className="text-zinc-400 dark:text-zinc-500 text-xs font-medium">{createdAt}</span>
      </div>

      {/* Title */}
      <h4 className="text-zinc-900 dark:text-zinc-100 font-semibold text-base leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2.5">
        {title && title.length > 34 ? title.trim().substring(0, 34) + "..." : title}
      </h4>

      {type === "youtube" ? (
        <div className="relative h-56 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800/50 mb-3">
          {!imgLoaded && (
            <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          )}
          <iframe
            className="w-full h-full rounded-xl"
            frameBorder="0"
            sandbox="allow-scripts allow-same-origin allow-presentation"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setImgLoaded(true)}
            src={contentUrl}
          />
        </div>
      ) : type == "tweet" ? (
        <div className="h-60 relative overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800/50 mb-3">
          {!tweetLoaded && (
            <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          )}
          <div
            ref={tweetRef}
            className={`h-60 overflow-hidden flex justify-center items-start ${
              tweetLoaded ? "opacity-100" : "opacity-0"
            } transition-opacity duration-200`}
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
          <div className="relative h-56 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800/50 mb-3">
            {!imgLoaded && (
              <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            )}
            <img
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              src={imageUrl}
              className={`h-full w-full object-cover rounded-xl ${
                imgLoaded ? "opacity-100" : "opacity-0"
              } transition-opacity duration-200`}
              onLoad={() => setImgLoaded(true)}
            />
          </div>
        )
      )}

      {/* Description */}
      <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-3">
        {description}
      </p>

      {/* Footer */}
      {(author || type === "article") && (
        <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800/60 mt-auto">
          {author && (
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 truncate">
              {author}
            </span>
          )}
          {type === "article" && (
            <a
              href={contentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex ml-auto items-center gap-0.5 transition-colors"
            >
              Read Article
              <RiArrowRightUpFill size={15} />
            </a>
          )}
        </div>
      )}
    </div>
  );
};

