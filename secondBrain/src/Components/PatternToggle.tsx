import { BsGrid3X3 } from "react-icons/bs";
import { TbGridDots } from "react-icons/tb";
import { useRecoilState } from "recoil";
import { BgPatternAtom } from "../Recoil/BgPatternAtom";

export const PatternToggle = () => {
  const [pattern, setPattern] = useRecoilState(BgPatternAtom);

  const togglePattern = () => {
    const next = pattern === "grid" ? "dots" : "grid";
    setPattern(next);
    localStorage.setItem("cerebro_bg_pattern", next);
  };

  return (
    <button
      onClick={togglePattern}
      title={pattern === "grid" ? "Switch to Dots Background" : "Switch to Grid Lines Background"}
      className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/90 dark:hover:bg-zinc-700/90 text-zinc-700 dark:text-zinc-300 transition-colors flex items-center justify-center cursor-pointer shadow-sm border border-zinc-200/60 dark:border-zinc-700/60"
      aria-label="Toggle Background Pattern"
    >
      {pattern === "grid" ? (
        <BsGrid3X3 size={18} className="text-zinc-700 dark:text-zinc-300" />
      ) : (
        <TbGridDots size={18} className="text-indigo-600 dark:text-indigo-400" />
      )}
    </button>
  );
};
