export interface PostCardProps {
  id: string;
  author: {
    name: string;
    avatar: string;
    followers: number;
  };
  timestamp: string;
  content: string;
  link?: string;
  image?: string;
  likes?: number;
  comments?: number;
  liked?: boolean;
  onLike?: () => void;
}
