import { useState } from "react";
import { AiOutlineYoutube } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { CiLogout, CiTwitter } from "react-icons/ci";
import { GiNotebook } from "react-icons/gi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { PiArticleNyTimesDuotone } from "react-icons/pi";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { VscRobot } from "react-icons/vsc";
import { NavLink, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { SideBarAtom } from "../Recoil/SideBarAtom";

export const Leftbar = () => {
  const [isCollapsed, setIsCollapsed] = useRecoilState(SideBarAtom);
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
    } else {
      try {
        return localStorage.getItem("userName") || "";
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
  const uncollapseSideBar = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300 md:hidden ${!isCollapsed ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsCollapsed(true)}
      />
      <span
        className={`fixed z-40 top-0 left-0 ${isCollapsed ? "w-13.75 max-md:-translate-x-full" : "w-60 max-md:translate-x-0"} max-md:w-60 max-md:border-r-gray-200 dark:max-md:border-r-gray-800 p-2 h-screen bg-slate-50 dark:bg-black text-zinc-900 dark:text-white border-r-2 border-zinc-200 dark:border-black flex flex-col justify-between transition-transform duration-300 ease-in-out max-md:shadow-2xl`}
      >
      <div className="upper-section">
        <div className="top-logo-section flex justify-between">
          <div
            className={`text-zinc-900 dark:text-white max-md:text-lg text-xl ${isCollapsed ? "" : "pl-4"} items-center gap-3 title flex mb-8`}
          >
            <img src="/Assets/isolated_brain.png" className="w-10 h-10 object-contain" alt="CereBro Logo" />
          </div>
          <button
            onClick={() => {
              setIsCollapsed(true);
            }}
            style={isCollapsed ? { display: "none" } : {}}
            className="cursor-pointer text-zinc-900 dark:text-white max-md:text-lg text-xl pl-4  gap-3 title mb-8 hover:text-primary transition-colors"
          >
            <TbLayoutSidebarLeftCollapse />
          </button>
        </div>
        <div
          className={`mid-elems-section text-left flex flex-col ${isCollapsed ? "items-center" : ""} gap-2 mb-8`}
        >
          <NavLink
            onClick={() => {
              uncollapseSideBar();
            }}
            className={({ isActive }) =>
              `cursor-pointer text-left text-zinc-600 dark:text-[#a9a9a9] ${isCollapsed ? "flex w-full justify-center" : "pl-4"} flex 
            items-center gap-2 py-2 focus:text-primary dark:focus:text-white hover:text-primary dark:hover:text-white
             focus:bg-zinc-200 dark:focus:bg-[#30302E] hover:bg-zinc-200 dark:hover:bg-[#30302E] transition-colors ${isActive ? "text-primary dark:text-white bg-zinc-200 dark:bg-[#30302E] rounded-md" : ""}`
            }
            to={"/dashboard/all-content"}
          >
            <IoChatboxEllipsesOutline
              title="All Content"
              size={20}
              className={isCollapsed ? "text-zinc-500" : "text-zinc-500 dark:text-gray-400"}
            />
            {!isCollapsed && "All Content"}
          </NavLink>
          <NavLink
            to={"/dashboard/thoughts"}
            onClick={() => {
              uncollapseSideBar();
            }}
            className={({ isActive }) =>
              `cursor-pointer flex text-zinc-600 dark:text-[#a9a9a9] ${isCollapsed ? "flex w-full justify-center" : "pl-4"} items-center gap-2 py-2 focus:text-primary dark:focus:text-white hover:text-primary dark:hover:text-white focus:bg-zinc-200 dark:focus:bg-[#30302E] hover:bg-zinc-200 dark:hover:bg-[#30302E] transition-colors ${isActive ? "text-primary dark:text-white bg-zinc-200 dark:bg-[#30302E] rounded-md" : ""}`
            }
          >
            <GiNotebook title="Thoughts" size={20} className="text-purple-400" />
            {!isCollapsed && "Thoughts"}
          </NavLink>
          <NavLink
            to={"/dashboard/tweeter-content"}
            onClick={() => {
              uncollapseSideBar();
            }}
            className={({ isActive }) =>
              `cursor-pointer flex text-zinc-600 dark:text-[#a9a9a9] ${isCollapsed ? "flex w-full justify-center" : "pl-4"} items-center gap-2 py-2 focus:text-primary dark:focus:text-white hover:text-primary dark:hover:text-white focus:bg-zinc-200 dark:focus:bg-[#30302E] hover:bg-zinc-200 dark:hover:bg-[#30302E] transition-colors ${isActive ? "text-primary dark:text-white bg-zinc-200 dark:bg-[#30302E] rounded-md" : ""}`
            }
          >
            <CiTwitter title="Twitter" size={20} className="text-[#1DA1F2]" />
            {!isCollapsed && "Twitter"}
          </NavLink>
          <NavLink
            onClick={() => {
              uncollapseSideBar();
            }}
            to={"/dashboard/youtube-content"}
            className={({ isActive }) =>
              `cursor-pointer flex text-zinc-600 dark:text-[#a9a9a9] ${isCollapsed ? "flex w-full justify-center" : "pl-4"} items-center gap-2 py-2 focus:text-primary dark:focus:text-white hover:text-primary dark:hover:text-white focus:bg-zinc-200 dark:focus:bg-[#30302E] hover:bg-zinc-200 dark:hover:bg-[#30302E] transition-colors ${isActive ? "text-primary dark:text-white bg-zinc-200 dark:bg-[#30302E] rounded-md" : ""}`
            }
          >
            <AiOutlineYoutube title="Youtube" className="text-red-500" size={20} />
            {!isCollapsed && "Youtube"}
          </NavLink>
          <NavLink
            onClick={() => {
              uncollapseSideBar();
            }}
            to={"/dashboard/article-content"}
            className={({ isActive }) =>
              `cursor-pointer flex text-zinc-600 dark:text-[#a9a9a9] ${isCollapsed ? "flex w-full justify-center" : "pl-4"} items-center gap-2 py-2 focus:text-primary dark:focus:text-white hover:text-primary dark:hover:text-white focus:bg-zinc-200 dark:focus:bg-[#30302E] hover:bg-zinc-200 dark:hover:bg-[#30302E] transition-colors ${isActive ? "text-primary dark:text-white bg-zinc-200 dark:bg-[#30302E] rounded-md" : ""}`
            }
          >
            <PiArticleNyTimesDuotone size={20} className="text-amber-500" />
            {!isCollapsed && "Article"}
          </NavLink>

          <NavLink
            onClick={() => {
              uncollapseSideBar();
            }}
            to={"/dashboard/chat-with-ai"}
            className={({ isActive }) =>
              `cursor-pointer flex text-zinc-600 dark:text-[#a9a9a9] ${isCollapsed ? "flex w-full justify-center" : "pl-4"} items-center gap-2 py-2 focus:text-primary dark:focus:text-white hover:text-primary dark:hover:text-white focus:bg-zinc-200 dark:focus:bg-[#30302E] hover:bg-zinc-200 dark:hover:bg-[#30302E] transition-colors ${isActive ? "text-primary dark:text-white bg-zinc-200 dark:bg-[#30302E] rounded-md" : ""}`
            }
          >
            <VscRobot title="Ask AI" size={20} className="text-cyan-400" />
            {!isCollapsed && "Ask AI"}
          </NavLink>
        </div>
      </div>
      <div className="lower-section">
        <div
          className={`bottom-profile-section ${isCollapsed ? "" : "p-2 bg-zinc-200 dark:bg-[#30302E] rounded"} `}
        >
          <div
            className="profile+name flex items-center gap-2 mb-4"
            title="Profile"
          >
            {userPicture == "" ? (
              <span className="rounded-full">
                <CgProfile size={24} />
              </span>
            ) : (
              <img src={userPicture} className="rounded-full w-7 h-7" />
            )}
            <span className="max-md:text-sm"> {!isCollapsed && (userName ? userName : "Guest User")}</span>
          </div>
          {/* <div className="flex items-center gap-2 mb-4" title="Settings">
            <CiSettings size={24} />
            {!isCollapsed && "Settings"}
          </div> */}
          <button
            onClick={() => logout()}
            className="flex cursor-pointer items-center gap-2 mb-4"
          >
            <CiLogout size={24} title="Logout" />
            {!isCollapsed && "Logout"}
          </button>
        </div>
      </div>
    </span>
    </>
  );
};
