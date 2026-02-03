import { useEffect } from "react";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import Masonry from "react-masonry-css";
import { useRecoilState } from "recoil";
import imgSrc from "../assets/Gemini_Generated_Image_r70ze4r70ze4r70z.png";
import type { ThoughtProps } from "../Models/CardProps";
import { ThoughtAtom } from "../Recoil/Thought";
import Thought from "./Thought";

const breakpointColumns = {
  default: 3,
  1100: 2,
  700: 1,
};

export default function Thoughts() {
  const [thoughts, setThoughts] = useRecoilState(ThoughtAtom);

  console.log(thoughts, "thoughts data");
  async function asyncDataFetch() {
    const data = await fetch("http://localhost:3000/v0/api/get-all-thoughts", {
      method: "GET",
      headers: {
        token: localStorage.getItem("token") as string,
      },
    });
    const res = await data.json();
    setThoughts([...res["AllUserContent"]]);
  }
  useEffect(() => {
    asyncDataFetch();
  }, []);
  return (
    <>
      {thoughts.length > 0 && (
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex ml-72 mt-13 px-5 pt-4 gap-4"
          columnClassName="masonry-column"
        >
          {thoughts.map((elem: ThoughtProps) => {
            return (
              <Thought
                title={elem.title}
                _id={elem._id}
                userId={elem.userId}
                createdAt={elem.createdAt.split("T")[0]}
                imageUrl={elem.imageUrl}
                type={elem.type}
                description={elem.description}
                key={elem._id}
              />
            );
          })}
        </Masonry>
      )}
      {thoughts.length == 0 && (
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
              Start by adding your first Thought
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
    </>
  );
}
