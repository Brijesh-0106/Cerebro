import { useEffect } from "react";
import Masonry from "react-masonry-css";
import { useRecoilState } from "recoil";
import type { CardProps } from "../Models/CardProps";
import { CardAtom } from "../Recoil/CardAtom";
import { Card } from "./Card";

// In your component
const breakpointColumns = {
  default: 3,
  1100: 2,
  700: 1,
};

export const Cards = () => {
  const [cards, setCards] = useRecoilState(CardAtom);
  console.log(cards, "cards data");
  async function asyncDataFetch() {
    const data = await fetch("http://localhost:3000/v0/api/get-all-content", {
      method: "GET",
      headers: {
        token: localStorage.getItem("token") as string,
      },
    });
    const res = await data.json();
    setCards([...res["AllUserContent"]]);
  }
  useEffect(() => {
    asyncDataFetch();
  }, []);
  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex ml-72 mt-13 px-5 pt-4 gap-4"
      columnClassName="masonry-column"
    >
      {cards.map((elem: CardProps) => {
        return (
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
        );
      })}
    </Masonry>
  );
};
