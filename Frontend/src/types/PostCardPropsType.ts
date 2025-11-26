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

  // OLD (single image)
  // image?: string;

  // NEW (multiple images/videos)
  mediaUrls: string[];

  likes?: number;
  comments?: number;
  commentList?: Comment[]; // actual comments array
  liked?: boolean;
  onLike?: (updateUI: (liked: boolean, count: number) => void) => void;
  onRemove?: (id: string) => void;
  onReport?: (id: string) => void;
  context?: "home" | "profile";
}
