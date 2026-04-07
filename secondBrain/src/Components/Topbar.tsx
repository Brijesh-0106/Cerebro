import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { useRecoilValue } from "recoil";
import { SideBarAtom } from "../Recoil/SideBarAtom";

export const Topbar = ({
  setCurr,
  curr,
}: {
  setCurr: (inp: boolean) => void;
  curr: boolean;
}) => {
  const isSideBarCollapsed = useRecoilValue(SideBarAtom);
  return (
    <div className="fixed bg-[#30302E] z-2 border-b border-b-[rgb(37,40,51)] top-0 w-screen flex justify-between py-3 px-8 gap-4 max-h-16">
      <div
        className={`text-white ${isSideBarCollapsed ? "ml-13.75" : "ml-60"} text-xl flex justify-center`}
      >
        <span
          className="great-vibes font-semibold font-[Great_Vibes,cursive] text-[24px] text-indigo-600
           scale-x-[1.3]  
           tracking-[0.05em]"
        >
          Cerebro{" "}
        </span>
      </div>
      <div className="flex justify-center gap-4">
        <button
          className="cursor-pointer px-3 py-1 bg-indigo-600 text-white rounded flex items-center gap-1"
          onClick={() => {
            setCurr(!curr);
          }}
        >
          <MdOutlineAddPhotoAlternate size={20} />
          Add Content
        </button>
      </div>
    </div>
  );
};
