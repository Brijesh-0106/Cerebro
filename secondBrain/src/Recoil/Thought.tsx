import { atom } from "recoil";
import type { ThoughtProps } from "../Models/CardProps";

export const ThoughtAtom = atom<ThoughtProps[]>({
  key: "ThoughtAtom",
  default: [],
});
