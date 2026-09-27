import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { VscRobot } from "react-icons/vsc";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export const Topbar = ({
  setCurr,
  curr,
}: {
  setCurr: (inp: boolean) => void;
  curr: boolean;
}) => {
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

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-slate-50/90 dark:bg-[#080910]/90 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800/90 h-14 md:h-16 flex items-center justify-between px-3 sm:px-4 md:px-8 transition-colors shadow-sm dark:shadow-black/40">

      {/* ── Left: Logo + Nav ── */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">

        {/* Logo */}
        <Link
          to="/dashboard/all-content"
          className="flex items-center gap-1.5 sm:gap-2 group cursor-pointer shrink-0"
        >
          <img
            src="/Assets/isolated_brain.png"
            alt="Cerebro Logo"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
          />
          <span className="hidden sm:inline font-[Courgette] font-bold text-xl md:text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
            Cerebro
          </span>
        </Link>

        {/* Divider */}
        <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-700 shrink-0 hidden xs:block" />

        {/* Nav Tabs */}
        <nav className="flex items-center gap-0.5 sm:gap-1">
          <NavLink
            to="/dashboard/all-content"
            className={({ isActive }) =>
              `px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              }`
            }
          >
            Content
          </NavLink>

          <NavLink
            to="/dashboard/chat-with-ai"
            className={({ isActive }) =>
              `px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-1.5 transition-all whitespace-nowrap ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
              }`
            }
          >
            <VscRobot size={14} className="shrink-0 text-inherit" />
            <span>Ask AI</span>
          </NavLink>
        </nav>
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">

        {/* Add Content Button */}
        <button
          className="cursor-pointer flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-full font-medium transition-all shadow-sm hover:shadow hover:scale-[1.02] active:scale-[0.98]
            px-2.5 py-1.5 text-xs
            sm:px-3.5 sm:py-1.5 sm:text-xs
            md:px-4 md:py-2 md:text-sm"
          onClick={() => {
            setCurr(!curr);
          }}
        >
          <MdOutlineAddPhotoAlternate size={16} className="shrink-0" />
          <span className="hidden sm:inline">Add Content</span>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Divider */}
        <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-700 hidden xs:block" />

        {/* Profile chip */}
        <div className="flex items-center gap-1 sm:gap-2 py-1 px-1.5 sm:px-2 rounded-full bg-zinc-100/90 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60">
          {userPicture ? (
            <img
              src={userPicture}
              alt="Profile"
              className="w-6 h-6 rounded-full object-cover shrink-0"
            />
          ) : (
            <CgProfile size={18} className="text-zinc-600 dark:text-zinc-300 shrink-0" />
          )}
          <span className="text-xs font-medium hidden lg:block max-w-24 truncate text-zinc-800 dark:text-zinc-200">
            {userName || "Guest"}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          title="Logout"
          className="p-1.5 rounded-full text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
          aria-label="Logout"
        >
          <CiLogout size={18} />
        </button>
      </div>
    </header>
  );
};
