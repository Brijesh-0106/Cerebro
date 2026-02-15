import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { useRecoilValue } from "recoil";
import { SideBarAtom } from "../Recoil/SideBarAtom";

export const Topbar = (props: any) => {
  const isSideBarCollapsed = useRecoilValue(SideBarAtom);
  return (
    <div className="fixed bg-[#30302E] z-2 border-b border-b-[rgb(37,40,51)] top-0 w-screen flex justify-between py-3 px-8 gap-4 max-h-16">
      <div
        className={`text-white ${isSideBarCollapsed ? "ml-13.75" : "ml-60"} text-xl flex justify-center`}
      >
        {" "}
        Cerebro
      </div>
      <div className="flex justify-center gap-4">
        {/* <button className="cursor-pointer px-3 py-1 hover:#D9C7EE  bg-[#E6D8F2] rounded flex items-center gap-1">
          <HiOutlineShare size={20} />
          Share Content
        </button> */}
        <button
          className="cursor-pointer px-3 py-1 bg-indigo-600 text-white rounded flex items-center gap-1"
          onClick={() => {
            props.setCurr(!props.curr);
          }}
        >
          <MdOutlineAddPhotoAlternate size={20} />
          Add Content
        </button>
      </div>
    </div>
  );
};
