import { atom } from "recoil";
import type { CardProps } from "../Models/CardProps";

export const CardAtom = atom<CardProps[]>({
  key: "CardsAtom",
  default: [],
});
