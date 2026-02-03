export interface CardProps {
  _id?: string;
  type: "youtube" | "tweet";
  createdAt: string;
  title: string;
  contentUrl: string;
  description: string;
  tags?: Array<Option>;
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
