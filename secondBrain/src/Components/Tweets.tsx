import { useEffect, useState } from "react";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import Masonry from "react-masonry-css";
import { useRecoilState } from "recoil";
import type { CardProps } from "../Models/CardProps";
import { CardAtom } from "../Recoil/CardAtom";
import { Card } from "./Card";
import { SkeletonGrid } from "./SkeletonGrid";

export default function Tweets() {
  const [cards, setCards] = useRecoilState(CardAtom);
  const [loading, setLoading] = useState(false);

  const breakpointColumns = {
    default: 4,
    1536: 4,
    1280: 3,
    768: 2,
    500: 1,
  };

  useEffect(() => {
    async function asyncDataFetch() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const data = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/v0/api/get-all-tweet-content/`,
          {
            method: "GET",
            headers: {
              token: token as string,
            },
          },
        );
        if (data.ok) {
          const res = await data.json();
          setCards([...(res["AllUserContent"] || [])]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    asyncDataFetch();
  }, []);
  return (
    <div className="max-w-7xl mx-auto mt-20 px-6 pb-16">

      {loading && <SkeletonGrid />}
      {!loading && !cards.length && (
        <div className="flex h-[calc(100vh-200px)] gap-4 flex-col justify-center items-center">
          <div className="p-8 rounded-3xl bg-white/60 dark:bg-[#141620]/60 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-sm max-w-md w-full flex flex-col items-center text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="h-28 w-28 mb-4">
              <img
                src="/Assets/isolated_brain.png"
                className="h-full w-full object-contain filter drop-shadow-md"
                alt="Brain logo"
              />
            </div>
            <h3 className="text-zinc-900 dark:text-zinc-100 font-bold text-xl tracking-tight">
              No tweets saved yet
            </h3>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-sm max-w-xs leading-relaxed">
              Bookmark important tweets, threads, and insights from X to revisit anytime.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  const addBtn = document.querySelector('header button[class*="rounded-full"]') as HTMLElement;
                  if (addBtn) addBtn.click();
                }}
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-full flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <HiOutlineChatBubbleLeftRight size={18} />
                Add Tweet
              </button>
            </div>
          </div>
        </div>
      )}
      {!loading && cards.length > 0 && (
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex -ml-4 w-auto"
          columnClassName="masonry-column pl-4"
        >
          {cards.map((elem: CardProps) => (
            <Card
              title={elem.title}
              _id={elem._id}
              userId={elem.userId}
              createdAt={elem.createdAt ? elem.createdAt.split("T")[0] : ""}
              contentUrl={elem.contentUrl}
              type={elem.type}
              description={elem.description}
              key={elem._id}
            />
          ))}
        </Masonry>
      )}
    </div>
  );
}

