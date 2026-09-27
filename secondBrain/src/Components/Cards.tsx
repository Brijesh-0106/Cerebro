import { useEffect, useState } from "react";
import { AiOutlineYoutube } from "react-icons/ai";
import { CiTwitter } from "react-icons/ci";
import { GiNotebook } from "react-icons/gi";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { PiArticleNyTimesDuotone } from "react-icons/pi";
import Masonry from "react-masonry-css";
import { useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import type { CardProps } from "../Models/CardProps";
import { CardAtom } from "../Recoil/CardAtom";
import { Card } from "./Card";
import { SkeletonGrid } from "./SkeletonGrid";

const filters = [
  {
    id: "all",
    label: "All",
    icon: <IoChatboxEllipsesOutline size={14} />,
    activeClass:
      "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 ring-2 ring-zinc-900 dark:ring-white ring-offset-1 dark:ring-offset-[#0b0c10] shadow-sm",
    inactiveClass:
      "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60",
  },
  {
    id: "thought",
    label: "Thoughts",
    icon: <GiNotebook size={14} />,
    activeClass:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 ring-2 ring-violet-500 ring-offset-1 dark:ring-offset-[#0b0c10] shadow-sm",
    inactiveClass:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400 border border-violet-100 dark:border-violet-900/30",
  },
  {
    id: "tweet",
    label: "Twitter",
    icon: <CiTwitter size={15} />,
    activeClass:
      "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300 ring-2 ring-sky-500 ring-offset-1 dark:ring-offset-[#0b0c10] shadow-sm",
    inactiveClass:
      "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30",
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: <AiOutlineYoutube size={15} />,
    activeClass:
      "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 ring-2 ring-red-500 ring-offset-1 dark:ring-offset-[#0b0c10] shadow-sm",
    inactiveClass:
      "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-100 dark:border-red-900/30",
  },
  {
    id: "article",
    label: "Article",
    icon: <PiArticleNyTimesDuotone size={14} />,
    activeClass:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 ring-2 ring-amber-500 ring-offset-1 dark:ring-offset-[#0b0c10] shadow-sm",
    inactiveClass:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30",
  },
];

export const Cards = () => {
  const [cards, setCards] = useRecoilState(CardAtom);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const breakpointColumns = {
    default: 4,
    1536: 4,
    1280: 3,
    1024: 2,
    640: 1,
  };

  useEffect(() => {
    const highlightId = searchParams.get("highlight");
    if (highlightId) {
      setTimeout(() => {
        const element = document.getElementById(highlightId);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
        element?.classList.add("shadow-xl", "highlighted-card");
      }, 400);
    }
  }, [cards]);

  useEffect(() => {
    async function asyncContentDataFetch() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const data = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/v0/api/get-all-content`,
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
        console.error("Failed to fetch cards:", err);
      } finally {
        setLoading(false);
      }
    }
    asyncContentDataFetch();
  }, []);

  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredCards = cards.filter((card: CardProps) => {
    if (activeFilter === "all") return true;
    return card.type === activeFilter;
  });

  return (
    <div className="max-w-7xl mx-auto mt-14 md:mt-16 pb-16">

      {/* ── Sticky Filter Bar ── */}
      <div className="sticky top-14 md:top-16 z-20 bg-slate-50/95 dark:bg-[#080910]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800/60">
        <div className="flex items-center gap-2 px-3 sm:px-5 md:px-6 py-2.5 overflow-x-auto scrollbar-none">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex-shrink-0 cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                activeFilter === f.id ? f.activeClass : f.inactiveClass + " hover:opacity-100 opacity-75"
              }`}
            >
              {f.icon}
              <span className="hidden sm:inline">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Card Grid ── */}
      <div className="px-3 sm:px-5 md:px-6 pt-4 pb-4">
        {loading && <SkeletonGrid />}

        {!loading && !filteredCards.length && (
          <div className="flex h-[calc(100vh-230px)] gap-4 flex-col justify-center items-center">
            <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-[#141620]/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-sm max-w-md w-full flex flex-col items-center text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="h-20 w-20 sm:h-24 sm:w-24 mb-4">
                <img
                  src="/Assets/isolated_brain.png"
                  className="h-full w-full object-contain filter drop-shadow-md"
                  alt="Brain logo"
                />
              </div>
              <h3 className="text-zinc-900 dark:text-zinc-100 font-bold text-lg sm:text-xl tracking-tight">
                {activeFilter === "all"
                  ? "Welcome to your second brain"
                  : `No ${activeFilter} items yet`}
              </h3>
              <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-sm max-w-xs leading-relaxed">
                {activeFilter === "all"
                  ? "Start building your personal knowledge base by adding notes, links, and media."
                  : `Save your favorite ${activeFilter} content to access and chat with it anytime.`}
              </p>
              <div className="mt-5 sm:mt-6">
                <button
                  onClick={() => {
                    const addBtn = document.querySelector(
                      'header button[class*="rounded-full"]',
                    ) as HTMLElement;
                    if (addBtn) addBtn.click();
                  }}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-full flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  <HiOutlineChatBubbleLeftRight size={18} />
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && filteredCards.length > 0 && (
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex -ml-4 w-auto"
            columnClassName="masonry-column pl-4"
          >
            {filteredCards.map((elem: CardProps) => (
              <Card
                title={elem.title}
                _id={elem._id}
                imageUrl={elem.imageUrl}
                userId={elem.userId}
                author={elem.author}
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
    </div>
  );
};
