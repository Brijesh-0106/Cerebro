import { atom } from "recoil";

export const SideBarAtom = atom<boolean>({
  key: "SideBarAtom",
  default: false,
});
