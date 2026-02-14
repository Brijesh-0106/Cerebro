import { useState } from "react";
import { AiOutlineYoutube } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { CiLogout, CiSettings, CiTwitter } from "react-icons/ci";
import { GiBrain, GiNotebook } from "react-icons/gi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { VscRobot } from "react-icons/vsc";
import { NavLink, useNavigate } from "react-router-dom";

export const Leftbar = () => {
  const nav = useNavigate();
  const [userPicture] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser).picture || "";
      } catch {
        return "";
      }
    }
    return "";
  });
  const [userName] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser).name || "";
      } catch {
        return "";
      }
    }
    return "";
  });
  const logout = () => {
    localStorage.removeItem("token");
    if (localStorage.getItem("user")) {
      localStorage.removeItem("user");
    }
    nav("/login");
  };
  return (
    <span className="fixed z-3 top-0 left-0 w-60 p-2 h-screen bg-black text-white border-2 border-black flex flex-col justify-between">
      <div className="upper-section">
        <div className="top-logo-section flex justify-between">
          <div className="text-white text-xl pl-4 items-center gap-3 title flex mb-8">
            <GiBrain size={36} color="#4f39f6" />
          </div>
          <button className="cursor-pointer text-white text-xl pl-4 items-center gap-3 title flex mb-8">
            <TbLayoutSidebarLeftCollapse />
          </button>
        </div>
        <div className="mid-elems-section text-left flex flex-col gap-2 mb-8">
          <NavLink
            className={({ isActive }) =>
              `cursor-pointer text-left text-[#a9a9a9]  pl-4 flex 
            items-center gap-2 py-2 focus:text-white hover:text-white
             focus:bg-[#1c1e1f] hover:bg-[#1c1e1f] ${isActive ? "text-white bg-[#1c1e1f]" : "text-[#a9a9a9]"}`
            }
            to={"/dashboard/all-content"}
          >
            <IoChatboxEllipsesOutline
              size={20}
              color="#9CA3AF
"
            />{" "}
            All Content
          </NavLink>
          <NavLink
            to={"/dashboard/thoughts"}
            className={({ isActive }) =>
              `cursor-pointer flex text-[#a9a9a9] pl-4 items-center gap-2 py-2 focus:text-white hover:text-white focus:bg-[#1c1e1f] hover:bg-[#1c1e1f] ${isActive ? "text-white bg-[#1c1e1f]" : "text-[#a9a9a9]"}`
            }
          >
            <GiNotebook size={20} color="#E6D8F2" />
            Thoughts
          </NavLink>
          <NavLink
            to={"/dashboard/tweeter-content"}
            className={({ isActive }) =>
              `cursor-pointer flex text-[#a9a9a9] pl-4 items-center gap-2 py-2 focus:text-white hover:text-white focus:bg-[#1c1e1f] hover:bg-[#1c1e1f] ${isActive ? "text-white bg-[#1c1e1f]" : "text-[#a9a9a9]"}`
            }
          >
            <CiTwitter
              size={20}
              color="#1DA1F2
"
            />{" "}
            Twitter
          </NavLink>
          <NavLink
            to={"/dashboard/youtube-content"}
            className="cursor-pointer flex text-[#a9a9a9] pl-4 items-center gap-2  py-2 focus:text-white hover:text-white focus:bg-[#1c1e1f] hover:bg-[#1c1e1f]"
          >
            <AiOutlineYoutube color="red" size={20} /> Youtube
          </NavLink>

          <NavLink
            to={"/dashboard/chat-with-ai"}
            className="cursor-pointer flex text-[#a9a9a9] pl-4 items-center gap-2 py-2 focus:text-white hover:text-white focus:bg-[#1c1e1f] hover:bg-[#1c1e1f]"
          >
            <VscRobot size={20} color="#22D3EE" />
            Ask AI
          </NavLink>
        </div>
      </div>
      <div className="lower-section">
        <div className="bottom-profile-section p-2 bg-[#30302E] rounded">
          <div className="profile+name flex items-center gap-2 mb-4">
            {userPicture == "" ? (
              <span className="rounded-full">
                <CgProfile size={24} />
              </span>
            ) : (
              <img src={userPicture} className="rounded-full w-7 h-7" />
            )}
            <span>{userName}</span>
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
