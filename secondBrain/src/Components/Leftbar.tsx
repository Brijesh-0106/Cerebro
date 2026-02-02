import { AiOutlineYoutube } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { CiLogout, CiSettings, CiTwitter } from "react-icons/ci";
import { FaHistory } from "react-icons/fa";
import { GiBrain, GiNotebook } from "react-icons/gi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { VscRobot } from "react-icons/vsc";
import { NavLink, useNavigate } from "react-router-dom";

export const Leftbar = () => {
  const nav = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };
  return (
    <span className="fixed z-3 top-0 left-0 w-60 p-2 h-screen bg-black text-white border-2 border-black flex flex-col justify-between">
      <div className="upper-section">
        <div className="top-logo-section">
          <div className="text-white text-xl bg-[#1c1e1f] pl-4 items-center gap-3 title flex mb-8">
            <GiBrain size={36} color="#4f39f6" />
            Cerebro
          </div>
        </div>
        <div className="mid-elems-section text-left flex flex-col gap-2 mb-8">
          <NavLink
            className={
              "cursor-pointer text-left text-[#a9a9a9]  pl-4 flex items-center gap-2 py-2 focus:text-white hover:text-white focus:bg-[#1c1e1f] hover:bg-[#1c1e1f]"
            }
            to={"/dashboard/all-content"}
          >
            <IoChatboxEllipsesOutline size={20} /> All Content
          </NavLink>
          <NavLink
            to={"/dashboard/thoughts"}
            className="cursor-pointer flex text-[#a9a9a9] pl-4 items-center gap-2 py-2 focus:text-white hover:text-white focus:bg-[#1c1e1f] hover:bg-[#1c1e1f]"
          >
            <GiNotebook size={20} color="#4f39f6" /> Thoughts
          </NavLink>
          <NavLink
            to={"/dashboard/tweet"}
            className="cursor-pointer flex text-[#a9a9a9] pl-4 items-center gap-2 py-2 focus:text-white hover:text-white focus:bg-[#1c1e1f] hover:bg-[#1c1e1f]"
          >
            <CiTwitter size={20} /> Twitter
          </NavLink>
          <NavLink
            to={"/dashboard/youtube"}
            className="cursor-pointer flex text-[#a9a9a9] pl-4 items-center gap-2  py-2 focus:text-white hover:text-white focus:bg-[#1c1e1f] hover:bg-[#1c1e1f]"
          >
            <AiOutlineYoutube color="red" size={20} /> Youtube
          </NavLink>
          <NavLink
            to={"/dashboard/history"}
            className="cursor-pointer flex text-[#a9a9a9] pl-4 items-center gap-2 py-2 focus:text-white hover:text-white focus:bg-[#1c1e1f] hover:bg-[#1c1e1f]"
          >
            <FaHistory size={20} /> Chat history
          </NavLink>
          <NavLink
            to={"/dashboard/chat-wtih-ai"}
            className="cursor-pointer flex text-[#a9a9a9] pl-4 items-center gap-2 py-2 focus:text-white hover:text-white focus:bg-[#1c1e1f] hover:bg-[#1c1e1f]"
          >
            <VscRobot size={20} /> Chat with AI
          </NavLink>
        </div>
      </div>
      <div className="lower-section">
        <div className="bottom-profile-section p-2 bg-[#1c1e1f] rounded">
          <div className="profile+name flex items-center gap-2 mb-4">
            <span className="rounded-full">
              <CgProfile size={24} />
            </span>
            <span>Profile name</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <CiSettings size={24} />
            Settings
          </div>
          <button
            onClick={() => logout()}
            className="flex cursor-pointer items-center gap-2 mb-4"
          >
            <CiLogout size={24} />
            Logout
          </button>
        </div>
      </div>
    </span>
  );
};
