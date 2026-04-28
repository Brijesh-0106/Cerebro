import { atom } from "recoil";

// Check local storage or system preference for initial theme
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const ThemeAtom = atom<string>({
  key: "ThemeAtom",
  default: getInitialTheme(),
});
