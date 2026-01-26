export interface CardProps {
  id: string;
  type: "youtube" | "tweet";
  createdAt: string;
  title: string;
  contentUrl: string;
  description: string;
}

export type Option = {
  label: string;
  value: string;
  color: string;
};
