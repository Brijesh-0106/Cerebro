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
      <aside
        className={`fixed z-40 top-0 left-0 ${isCollapsed ? "w-13.75 max-md:-translate-x-full" : "w-60 max-md:translate-x-0"} max-md:w-60 p-3 h-screen bg-white/90 dark:bg-[#0c0d14]/90 backdrop-blur-md text-zinc-900 dark:text-zinc-100 border-r border-zinc-200/80 dark:border-zinc-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out max-md:shadow-2xl`}
      >
      <div className="upper-section">
        <div className="top-logo-section flex justify-between items-center mb-6 pt-1">
          <div
            className={`text-zinc-900 dark:text-white ${isCollapsed ? "justify-center w-full" : "pl-2"} items-center gap-3 title flex`}
          >
            <img src="/Assets/isolated_brain.png" className="w-9 h-9 object-contain drop-shadow-sm" alt="CereBro Logo" />
            {!isCollapsed && (
              <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                Cerebro
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setIsCollapsed(true);
            }}
            style={isCollapsed ? { display: "none" } : {}}
            className="cursor-pointer text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Collapse Sidebar"
          >
            <TbLayoutSidebarLeftCollapse size={20} />
          </button>
        </div>
        <div
          className={`mid-elems-section text-left flex flex-col ${isCollapsed ? "items-center" : ""} gap-1.5`}
        >
          <NavLink
            onClick={() => {
              uncollapseSideBar();
            }}
            className={({ isActive }) =>
              `cursor-pointer text-sm font-medium ${isCollapsed ? "flex w-10 h-10 justify-center items-center" : "px-3.5 py-2.5"} flex items-center gap-3 rounded-xl transition-all ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-white/10 dark:text-white dark:border dark:border-white/10 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100/90 dark:hover:bg-white/5"
              }`
            }
            to={"/dashboard/all-content"}
          >
            <IoChatboxEllipsesOutline
              title="All Content"
              size={20}
              className="shrink-0"
            />
            {!isCollapsed && <span>All Content</span>}
          </NavLink>
          <NavLink
            to={"/dashboard/thoughts"}
            onClick={() => {
              uncollapseSideBar();
            }}
            className={({ isActive }) =>
              `cursor-pointer text-sm font-medium ${isCollapsed ? "flex w-10 h-10 justify-center items-center" : "px-3.5 py-2.5"} flex items-center gap-3 rounded-xl transition-all ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-white/10 dark:text-white dark:border dark:border-white/10 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100/90 dark:hover:bg-white/5"
              }`
            }
          >
            <GiNotebook title="Thoughts" size={20} className="shrink-0 text-violet-500" />
            {!isCollapsed && <span>Thoughts</span>}
          </NavLink>
          <NavLink
            to={"/dashboard/tweeter-content"}
            onClick={() => {
              uncollapseSideBar();
            }}
            className={({ isActive }) =>
              `cursor-pointer text-sm font-medium ${isCollapsed ? "flex w-10 h-10 justify-center items-center" : "px-3.5 py-2.5"} flex items-center gap-3 rounded-xl transition-all ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-white/10 dark:text-white dark:border dark:border-white/10 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100/90 dark:hover:bg-white/5"
              }`
            }
          >
            <CiTwitter title="Twitter" size={20} className="shrink-0 text-[#1DA1F2]" />
            {!isCollapsed && <span>Twitter</span>}
          </NavLink>
          <NavLink
            onClick={() => {
              uncollapseSideBar();
            }}
            to={"/dashboard/youtube-content"}
            className={({ isActive }) =>
              `cursor-pointer text-sm font-medium ${isCollapsed ? "flex w-10 h-10 justify-center items-center" : "px-3.5 py-2.5"} flex items-center gap-3 rounded-xl transition-all ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-white/10 dark:text-white dark:border dark:border-white/10 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100/90 dark:hover:bg-white/5"
              }`
            }
          >
            <AiOutlineYoutube title="Youtube" className="shrink-0 text-red-500" size={20} />
            {!isCollapsed && <span>Youtube</span>}
          </NavLink>
          <NavLink
            onClick={() => {
              uncollapseSideBar();
            }}
            to={"/dashboard/article-content"}
            className={({ isActive }) =>
              `cursor-pointer text-sm font-medium ${isCollapsed ? "flex w-10 h-10 justify-center items-center" : "px-3.5 py-2.5"} flex items-center gap-3 rounded-xl transition-all ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-white/10 dark:text-white dark:border dark:border-white/10 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100/90 dark:hover:bg-white/5"
              }`
            }
          >
            <PiArticleNyTimesDuotone size={20} className="shrink-0 text-amber-500" />
            {!isCollapsed && <span>Article</span>}
          </NavLink>

          <NavLink
            onClick={() => {
              uncollapseSideBar();
            }}
            to={"/dashboard/chat-with-ai"}
            className={({ isActive }) =>
              `cursor-pointer text-sm font-medium ${isCollapsed ? "flex w-10 h-10 justify-center items-center" : "px-3.5 py-2.5"} flex items-center gap-3 rounded-xl transition-all ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-white/10 dark:text-white dark:border dark:border-white/10 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100/90 dark:hover:bg-white/5"
              }`
            }
          >
            <VscRobot title="Ask AI" size={20} className="shrink-0 text-cyan-500" />
            {!isCollapsed && <span>Ask AI</span>}
          </NavLink>
        </div>
      </div>
      <div className="lower-section">
        <div
          className={`bottom-profile-section ${isCollapsed ? "flex flex-col items-center gap-2 p-1" : "p-3 bg-zinc-100/80 dark:bg-[#14161f] border border-zinc-200/70 dark:border-zinc-800/80 rounded-xl"} `}
        >
          <div
            className="profile+name flex items-center gap-2.5 mb-3"
            title="Profile"
          >
            {userPicture == "" ? (
              <span className="rounded-full text-zinc-600 dark:text-zinc-300">
                <CgProfile size={24} />
              </span>
            ) : (
              <img src={userPicture} className="rounded-full w-7 h-7 object-cover" />
            )}
            <span className="text-sm font-medium truncate text-zinc-800 dark:text-zinc-200">
              {!isCollapsed && (userName ? userName : "Guest User")}
            </span>
          </div>
          <button
            onClick={() => logout()}
            className="flex cursor-pointer items-center gap-2 text-sm text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 transition-colors w-full"
          >
            <CiLogout size={20} title="Logout" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
    </>
  );
};
