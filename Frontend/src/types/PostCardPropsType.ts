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

  mediaUrls: string[];

  likes?: number;
  comments?: number;
  commentList?: Comment[];
  liked?: boolean;
  onLike?: () => void;
  onRemove?: (id: string) => void;
  onReport?: (id: string) => void;
  context?: "home" | "profile";
}
