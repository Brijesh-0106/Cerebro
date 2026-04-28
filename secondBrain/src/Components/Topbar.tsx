import { FiMenu } from "react-icons/fi";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { useRecoilState } from "recoil";
import { SideBarAtom } from "../Recoil/SideBarAtom";
import { ThemeToggle } from "./ThemeToggle";

export const Topbar = ({
  setCurr,
  curr,
}: {
  setCurr: (inp: boolean) => void;
  curr: boolean;
}) => {
  const [isSideBarCollapsed, setIsSideBarCollapsed] = useRecoilState(SideBarAtom);
  return (
    <div className="fixed bg-zinc-100 dark:bg-[#30302E] z-20 border-b border-zinc-300 dark:border-b-[rgb(37,40,51)] top-0 w-screen flex justify-between py-3 px-8 gap-4 max-h-16 max-md:px-4">
      <div
        className={`text-zinc-900 dark:text-white ${isSideBarCollapsed ? "ml-13.75" : "ml-[220px]"} max-md:ml-0 max-md:text-lg text-xl flex justify-center items-center gap-3 transition-all`}
      >
        <button
          className="hidden max-md:flex items-center justify-center p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-[rgba(255,255,255,0.1)] transition-colors"
          onClick={() => setIsSideBarCollapsed(!isSideBarCollapsed)}
        >
          <FiMenu size={24} className="text-primary" />
        </button>
        <span className="great-vibes font-semibold font-[Courgette] max-md:text-[20px] text-[24px] text-primary">
          Cerebro{" "}
        </span>
      </div>
      <div className="flex justify-center items-center gap-4">
        <ThemeToggle />
        <button
          className="cursor-pointer px-3 py-1 bg-primary text-white rounded flex items-center gap-1 max-md:px-2 max-md:text-sm transition-transform hover:scale-105"
          onClick={() => {
            setCurr(!curr);
          }}
        >
          <MdOutlineAddPhotoAlternate size={20} className="max-md:w-4 max-md:h-4" />
          <span className="max-md:hidden">Add Content</span>
          <span className="hidden max-md:inline">Add</span>
        </button>
      </div>
    </div>
  );
};
