import type { CardProps } from "./CardProps";

export interface ConversationProps {
  role: "user" | "assistant";
  content: string;
  timeStamp: string;
  sourceIds?: CardProps[];
}
