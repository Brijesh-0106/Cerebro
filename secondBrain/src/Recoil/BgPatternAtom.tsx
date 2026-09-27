import { atom } from "recoil";

export type BgPatternType = "grid" | "dots";

const getInitialPattern = (): BgPatternType => {
  const saved = localStorage.getItem("cerebro_bg_pattern") as BgPatternType;
  if (saved === "dots" || saved === "grid") {
    return saved;
  }
  // Default to grid lines as requested by user ("lines verticle and horixzontal instead of dots")
  return "grid";
};

export const BgPatternAtom = atom<BgPatternType>({
  key: "BgPatternAtom",
  default: getInitialPattern(),
});
