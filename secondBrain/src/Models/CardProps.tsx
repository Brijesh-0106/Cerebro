export interface CardProps {
  _id?: string;
  type: "youtube" | "tweet" | "thought";
  createdAt: string;
  title: string;
  contentUrl?: string;
  description: string;
  imageUrl?: FileList;
  tags?: Array<Option>;
  userId?: string;
}
export interface chatProps {
  _id?: string;
  userInput: string;
  userId?: string;
}
export interface ThoughtProps {
  _id?: string;
  type: "thought";
  createdAt: string;
  title: string;
  imageUrl?: FileList;
  description: string;
  tags?: Array<Option>;
  userId?: string;
}

export type Option = {
  label: string;
  value: string;
  color: string;
};

export type alertType = "success" | "error" | "warning" | "info";
