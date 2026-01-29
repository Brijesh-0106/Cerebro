export interface CardProps {
  _id?: string;
  type: "youtube" | "tweet";
  createdAt: string;
  title: string;
  contentUrl: string;
  description: string;
  userId?: string;
}

export type Option = {
  label: string;
  value: string;
  color: string;
};
