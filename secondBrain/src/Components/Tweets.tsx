import { useEffect, useState } from "react";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import Masonry from "react-masonry-css";
import { useRecoilState, useRecoilValue } from "recoil";
import type { CardProps } from "../Models/CardProps";
import { CardAtom } from "../Recoil/CardAtom";
import { SideBarAtom } from "../Recoil/SideBarAtom";
import { Card } from "./Card";
import { SkeletonGrid } from "./SkeletonGrid";

export default function Tweets() {
  const [cards, setCards] = useRecoilState(CardAtom);
  const [loading, setLoading] = useState(false);
  const isSideBarCollapsed = useRecoilValue(SideBarAtom);
  // In your component
  let breakpointColumns;
  if (isSideBarCollapsed) {
    breakpointColumns = {
      default: 5,
      1800: 4,
      1447: 3,
      1095: 2,
      743: 1,
    };
  } else {
    breakpointColumns = {
      default: 4,
      1680: 3,
      1328: 2,
      976: 1,
    };
  }

  useEffect(() => {
    async function asyncDataFetch() {
      setLoading(true);
      const data = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/v0/api/get-all-tweet-content/`,
        {
          method: "GET",
          headers: {
            token: localStorage.getItem("token") as string,
          },
        },
      );
      const res = await data.json();
      setCards([...res["AllUserContent"]]);
      setLoading(false);
    }
    asyncDataFetch();
  }, []);
  return (
    <>
      {loading && <SkeletonGrid />}
      {!cards.length && (
        <div
          className={`flex ${isSideBarCollapsed ? "ml-13.75" : "ml-65"} max-md:ml-0 mt-13 px-5 pt-4 h-[calc(100vh-130px)] gap-4 flex-col justify-center items-center`}
        >
          <div className="empty-cards-Image h-40 w-40 mt-10">
            <img
              src="/Assets/isolated_brain.png"
              className="h-full w-full object-contain p-2"
            />
          </div>
          <div className="empty-cards-desc text-zinc-900 dark:text-white">
            <div className="text-zinc-900 dark:text-white max-md:text-lg text-xl text-center">
              Welcome to your second brain
            </div>
            <div className="text-center mt-3 text-zinc-600 dark:text-[#a9a9a9] max-md:text-sm">
              Start by adding your first Item
            </div>
          </div>
          <div className="empty-cards-boxes">
            <button className="px-3 py-1 bg-primary/20 text-primary dark:bg-[#E6D8F2] dark:text-zinc-900 rounded flex items-center gap-1 hover:bg-primary/30 dark:hover:bg-purple-200 transition-colors">
              <HiOutlineChatBubbleLeftRight size={20} />
              Add Tweet
            </button>
          </div>
        </div>
      )}
      {cards.length > 0 && (
        <Masonry
          breakpointCols={breakpointColumns}
          className={`flex ${isSideBarCollapsed ? "ml-13.75" : "ml-72"} max-md:ml-0 mt-13 px-5 pt-4 gap-4`}
          columnClassName="masonry-column"
        >
          {cards.map((elem: CardProps) => (
            <Card
              title={elem.title}
              _id={elem._id}
              userId={elem.userId}
              createdAt={elem.createdAt.split("T")[0]}
              contentUrl={elem.contentUrl}
              type={elem.type}
              description={elem.description}
              key={elem._id}
            />
          ))}
        </Masonry>
      )}
      {/* when no cards added */}
    </>
  );
}
