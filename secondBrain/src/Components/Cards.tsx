import { useEffect, useState } from "react";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import Masonry from "react-masonry-css";
import { useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import imgSrc from "../assets/Gemini_Generated_Image_r70ze4r70ze4r70z.png";
import type { CardProps } from "../Models/CardProps";
import { CardAtom } from "../Recoil/CardAtom";
import { Card } from "./Card";
import { SkeletonGrid } from "./SkeletonGrid";

// In your component
const breakpointColumns = {
  default: 3,
  1100: 2,
  700: 1,
};

export const Cards = () => {
  const [cards, setCards] = useRecoilState(CardAtom);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    async function asyncContentDataFetch() {
      setLoading(true);

      const data = await fetch("http://localhost:3000/v0/api/get-all-content", {
        method: "GET",
        headers: {
          token: localStorage.getItem("token") as string,
        },
      });

      const res = await data.json();
      setCards([...res["AllUserContent"]]);

      setLoading(false);
    }
    asyncContentDataFetch();
    const highlightId = searchParams.get("highlight");
    console.log(highlightId, "check highlight id from url");
    if (highlightId) {
      const element = document.getElementById(highlightId);
      console.log(element, "check element to be highlighted");
      element?.scrollIntoView({ behavior: "smooth" });
      element?.classList.add(
        "ring-4",
        "ring-indigo-500",
        "shadow-2xl",
        "highlighted-card",
        "shadow-indigo-500/50",
        "animate-pulse",
      ); // Highlight
    }
  }, []);
  return (
    <>
      {loading && <SkeletonGrid />}
      {!cards.length && (
        <div className="flex ml-72 mt-13 px-5 pt-4 h-[calc(100vh-130px)] gap-4 flex-col justify-center items-center">
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
            <button className="cursor-pointer px-3 py-1 bg-[#E6D8F2]  rounded flex items-center gap-1">
              <HiOutlineChatBubbleLeftRight size={20} />
              Add Thought
            </button>
          </div>
        </div>
      )}
      {cards.length > 0 && (
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex ml-72 mt-13 px-5 pt-4 gap-4"
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
