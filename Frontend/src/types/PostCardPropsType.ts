import type { UserRole } from "./UserRole";

export interface PostCardProps {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    followers: number;
    role: UserRole;
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
