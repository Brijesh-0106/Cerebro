
import { FiMoon, FiSun } from "react-icons/fi";
import { useRecoilState } from "recoil";
import { ThemeAtom } from "../Recoil/ThemeAtom";

export const ThemeToggle = () => {
  const [theme, setTheme] = useRecoilState(ThemeAtom);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/90 dark:hover:bg-zinc-700/90 text-zinc-700 dark:text-zinc-300 transition-colors flex items-center justify-center cursor-pointer shadow-sm border border-zinc-200/60 dark:border-zinc-700/60"
      aria-label="Toggle Theme"
      title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      {theme === "light" ? (
        <FiMoon size={18} className="text-zinc-700" />
      ) : (
        <FiSun size={18} className="text-amber-400" />
      )}
    </button>
  );
};

