import Masonry from "react-masonry-css";
import { Card } from "./Card";

// In your component
const breakpointColumns = {
  default: 3,
  1100: 2,
  700: 1,
};

export const Cards = () => {
  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex ml-72 mt-13 px-5 pt-4 gap-4"
      columnClassName="masonry-column"
    >
      <Card
        type="youtube"
        id="1"
        createdAt="2024-06-01"
        contentUrl="https://www.youtube.com/watch?v=MJPdI1LlWmo"
        description="Discover how Second Brain transforms video content into rich, searchable knowledge. It doesn't just read captions; it watches the video, analyzes every frame, reads on-screen text, and understands the full context—just like you would."
        title="MOC Podcast for King"
      />
      <Card
        type="tweet"
        id="2"
        createdAt="2024-06-01"
        contentUrl="https://www.youtube.com/watch?v=MJPdI1LlWmo"
        description="Endgame did 357 crores in India out of which 250 crores done in first week. Holly movies dip after first week. Also single screens and tier 2-3 and all pe kaun he chalega holly movies.it watches the video, analyzes every frame, reads on-screen text, and understands the full context—just like you would."
        title="Trump tweet on Trump coin"
      />
      <Card
        type="tweet"
        id="2"
        createdAt="2024-06-01"
        contentUrl="https://www.youtube.com/watch?v=MJPdI1LlWmo"
        description="Endgame did 357 crores in India out of which 250 crores done in first week. Holly movies dip after first week. Also single screens and tier 2-3 and all pe kaun he chalega holly movies."
        title="Trump tweet on Trump coin"
      />
      <Card
        type="tweet"
        id="2"
        createdAt="2024-06-01"
        contentUrl="https://www.youtube.com/watch?v=MJPdI1LlWmo"
        description="Endgame did 357 crores in India out of which 250 crores done in first week. Holly movies dip after first week. Also single screens and tier 2-3 and all pe kaun he chalega holly movies."
        title="Trump tweet on Trump coin"
      />
      <Card
        type="tweet"
        id="1"
        createdAt="2024-06-01"
        contentUrl="https://www.youtube.com/watch?v=MJPdI1LlWmo"
        description="Endgame  Also single screens and tier 2-3 and all pe kaun he chalega holly movies."
        title="Trump tweet on Trump coin"
      />
      <Card
        type="tweet"
        id="1"
        createdAt="2024-06-01"
        contentUrl="https://www.youtube.com/watch?v=MJPdI1LlWmo"
        description="Endgame  Also single screens and tier 2-3 and all pe kaun he chalega holly movies."
        title="Trump tweet on Trump coin"
      />
      <Card
        type="youtube"
        id="1"
        createdAt="2024-06-01"
        contentUrl="https://www.youtube.com/watch?v=MJPdI1LlWmo"
        description="Discover how Second Brain transforms video content into rich, searchable knowledge. It doesn't just read captions; it watches the video, analyzes every frame, reads on-screen text, and understands the full context—just like you would."
        title="MOC Podcast for King"
      />
      <Card
        type="youtube"
        id="1"
        createdAt="2024-06-01"
        contentUrl="https://www.youtube.com/watch?v=MJPdI1LlWmo"
        description="Discover how Second Brain transforms video content into rich, searchable knowledge. It doesn't just read captions; it watches the video, analyzes every frame, reads on-screen text, and understands the full context—just like you would."
        title="MOC Podcast for King"
      />
      <Card
        type="tweet"
        id="1"
        createdAt="2024-06-01"
        contentUrl="https://www.youtube.com/watch?v=MJPdI1LlWmo"
        description="Endgame did 357 crores in India out of which 250 crores done in first week. Holly movies dip after first week. Also single screens and tier 2-3 and all pe kaun he chalega holly movies."
        title="Trump tweet on Trump coin"
      />
    </Masonry>
  );
};
