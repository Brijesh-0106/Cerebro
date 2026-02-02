import { HiOutlineShare } from "react-icons/hi2";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

export const Topbar = (props: any) => {
  return (
    <div className="fixed bg-[#1c1e1f] z-2 border-b border-b-[rgb(37,40,51)] top-0 w-screen flex flex-row-reverse py-3 px-8 gap-4 max-h-16">
      <button
        className="cursor-pointer px-3 py-1 bg-indigo-600 text-white rounded flex items-center gap-1"
        onClick={() => {
          props.setCurr(!props.curr);
        }}
      >
        <MdOutlineAddPhotoAlternate size={20} />
        Add Content
      </button>
      <button className="cursor-pointer px-3 py-1 hover:#D9C7EE  bg-[#E6D8F2] rounded flex items-center gap-1">
        <HiOutlineShare size={20} />
        Share Content
      </button>
    </div>
  );
};
