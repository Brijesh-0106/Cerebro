import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle";

export default function Navbar() {
  const nav = useNavigate();
  return (
    <nav className="w-full flex justify-between items-center px-4 sm:px-8 md:px-12 py-3 bg-white/75 dark:bg-[#0b0c10]/80 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 sticky top-0 z-30 transition-colors">
      <Link to="/" className="logoSection max-md:text-lg text-xl items-center gap-2 text-primary flex font-bold group">
        <img
          src="/Assets/isolated_brain.png"
          className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
          alt="CereBro Logo"
        />
        <div
          style={{ lineHeight: "36px", height: "36px" }}
          className="great-vibes font-semibold font-[Courgette] max-md:text-[24px] text-[28px] text-primary"
        >
          CereBro
        </div>
      </Link>
      <div className="flex items-center gap-3 sm:gap-4">
        <ThemeToggle />
        <button
          className="cursor-pointer font-medium text-sm sm:text-base px-4 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:border-indigo-600 dark:hover:border-indigo-500 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all duration-200 shadow-sm"
          onClick={() => nav("/signin")}
        >
          Sign In
        </button>
      </div>
    </nav>
  );
}
