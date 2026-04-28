
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
      className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-colors duration-300 ease-in-out hover:bg-zinc-300 dark:hover:bg-zinc-700 flex items-center justify-center cursor-pointer shadow-sm"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        <FiMoon size={20} className="text-zinc-800" />
      ) : (
        <FiSun size={20} className="text-yellow-400" />
      )}
    </button>
  );
};
