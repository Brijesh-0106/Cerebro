import { useEffect, useState } from "react";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import Masonry from "react-masonry-css";
import { useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import imgSrc from "../assets/Gemini_Generated_Image_r70ze4r70ze4r70z.png";
import type { CardProps } from "../Models/CardProps";
import { CardAtom } from "../Recoil/CardAtom";
import { SideBarAtom } from "../Recoil/SideBarAtom";
import { Card } from "./Card";
import { SkeletonGrid } from "./SkeletonGrid";

export const Cards = () => {
  const [cards, setCards] = useRecoilState(CardAtom);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const isSideBarCollapsed = useRecoilValue(SideBarAtom);
  // In your component
  let breakpointColumns;
  if (isSideBarCollapsed) {
    breakpointColumns = {
      default: 4,
      1400: 3,
      1100: 2,
      700: 1,
    };
  } else {
    breakpointColumns = {
      default: 3,
      1100: 2,
      700: 1,
    };
  }

  useEffect(() => {
    const highlightId = searchParams.get("highlight");
    if (highlightId) {
      const element = document.getElementById(highlightId);
      element?.scrollIntoView({ behavior: "smooth" });
      element?.classList.add("shadow-xl", "highlighted-card"); // Highlight
    }
  }, [cards]);
  useEffect(() => {
    async function asyncContentDataFetch() {
      setLoading(true);
      const data = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/v0/api/get-all-content`,
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
    asyncContentDataFetch();
  }, []);
  return (
    <>
      {loading && <SkeletonGrid />}
      {!cards.length && (
        <div
          className={`flex ${isSideBarCollapsed ? "ml-13.75" : "ml-65"} mt-13 px-5 pt-4 h-[calc(100vh-130px)] gap-4 flex-col justify-center items-center`}
        >
          <div className="empty-cards-Image h-60 w-60">
            <img
              src={imgSrc}
              className="rounded-3xl h-full w-full object-cover"
            />
          </div>
          <div className="empty-cards-desc text-white">
            <div className="text-white text-xl text-center">
              Welcome to your second brain
            </div>
            <div className="text-center mt-3 text-[#a9a9a9]">
              Start by adding your first Item
            </div>
          </div>
          <div className="empty-cards-boxes">
            <button className="px-3 py-1 bg-[#E6D8F2]  rounded flex items-center gap-1">
              <HiOutlineChatBubbleLeftRight size={20} />
              Add Thought
            </button>
          </div>
        </div>
      )}
      {cards.length > 0 && (
        <Masonry
          breakpointCols={breakpointColumns}
          className={`flex ${isSideBarCollapsed ? "ml-13.75" : "ml-72"} mt-13 px-5 pt-4 gap-4`}
          columnClassName="masonry-column"
        >
          {cards.map((elem: CardProps) => (
            <Card
              title={elem.title}
              _id={elem._id}
              imageUrl={elem.imageUrl}
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
};
