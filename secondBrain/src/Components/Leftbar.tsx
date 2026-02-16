import { useState } from "react";
import { AiOutlineYoutube } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { CiLogout, CiSettings, CiTwitter } from "react-icons/ci";
import { GiBrain, GiNotebook } from "react-icons/gi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
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
    <span
      className={`fixed z-3 top-0 left-0 ${isCollapsed ? "w-13.75" : "w-60"} p-2 h-screen bg-black text-white border-2 border-black flex flex-col justify-between`}
    >
      <div className="upper-section">
        <div className="top-logo-section flex justify-between">
          <div
            className={`text-white text-xl ${isCollapsed ? "" : "pl-4"} items-center gap-3 title flex mb-8`}
          >
            <GiBrain size={36} color="#4f39f6" />
          </div>
          <button
            onClick={() => {
              setIsCollapsed(true);
            }}
            style={isCollapsed ? { display: "none" } : {}}
            className="cursor-pointer text-white text-xl pl-4  gap-3 title mb-8"
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
              `cursor-pointer text-left text-[#a9a9a9]  ${isCollapsed ? "flex w-full justify-center" : "pl-4"} flex 
            items-center gap-2 py-2 focus:text-white hover:text-white
             focus:bg-[#30302E] hover:bg-[#30302E] ${isActive ? "text-white bg-[#30302E] rounded-md" : "text-[#a9a9a9]"}`
            }
            to={"/dashboard/all-content"}
          >
            <IoChatboxEllipsesOutline
              title="All Content"
              size={20}
              color="#9CA3AF"
            />
            {!isCollapsed && "All Content"}
          </NavLink>
          <NavLink
            to={"/dashboard/thoughts"}
            onClick={() => {
              uncollapseSideBar();
            }}
            className={({ isActive }) =>
              `cursor-pointer flex text-[#a9a9a9] ${isCollapsed ? "flex w-full justify-center" : "pl-4"} items-center gap-2 py-2 focus:text-white hover:text-white focus:bg-[#30302E] hover:bg-[#30302E] ${isActive ? "text-white bg-[#30302E]  rounded-md" : "text-[#a9a9a9]"}`
            }
          >
            <GiNotebook title="Thoughts" size={20} color="#E6D8F2" />
            {!isCollapsed && "Thoughts"}
          </NavLink>
          <NavLink
            to={"/dashboard/tweeter-content"}
            onClick={() => {
              uncollapseSideBar();
            }}
            className={({ isActive }) =>
              `cursor-pointer flex text-[#a9a9a9] ${isCollapsed ? "flex w-full justify-center" : "pl-4"} items-center gap-2 py-2 focus:text-white hover:text-white focus:bg-[#30302E] hover:bg-[#30302E] ${isActive ? "text-white bg-[#30302E]  rounded-md" : "text-[#a9a9a9]"}`
            }
          >
            <CiTwitter title="Twitter" size={20} color="#1DA1F2" />
            {!isCollapsed && "Twitter"}
          </NavLink>
          <NavLink
            onClick={() => {
              uncollapseSideBar();
            }}
            to={"/dashboard/youtube-content"}
            className={({ isActive }) =>
              `cursor-pointer flex text-[#a9a9a9] ${isCollapsed ? "flex w-full justify-center" : "pl-4"} items-center gap-2  py-2 focus:text-white hover:text-white focus:bg-[#30302E] hover:bg-[#30302E] ${isActive ? "text-white bg-[#30302E]  rounded-md" : "text-[#a9a9a9]"}`
            }
          >
            <AiOutlineYoutube title="Youtube" color="red" size={20} />
            {!isCollapsed && "Youtube"}
          </NavLink>

          <NavLink
            onClick={() => {
              uncollapseSideBar();
            }}
            to={"/dashboard/chat-with-ai"}
            className={({ isActive }) =>
              `cursor-pointer flex text-[#a9a9a9] ${isCollapsed ? "flex w-full justify-center" : "pl-4"} items-center gap-2 py-2 focus:text-white hover:text-white focus:bg-[#30302E] hover:bg-[#30302E] ${isActive ? "text-white bg-[#30302E] rounded-md" : "text-[#a9a9a9]"}`
            }
          >
            <VscRobot title="Ask AI" size={20} color="#22D3EE" />
            {!isCollapsed && "Ask AI"}
          </NavLink>
        </div>
      </div>
      <div className="lower-section">
        <div
          className={`bottom-profile-section ${isCollapsed ? "" : "p-2 bg-[#30302E] rounded"} `}
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
            <span> {!isCollapsed && (userName ? userName : "Guest User")}</span>
          </div>
          <div className="flex items-center gap-2 mb-4" title="Settings">
            <CiSettings size={24} />
            {!isCollapsed && "Settings"}
          </div>
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
  );
};
