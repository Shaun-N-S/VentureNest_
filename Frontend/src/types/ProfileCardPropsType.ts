export interface ProfileCardProps {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  verified?: boolean;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  onFollow?: () => void;
  isFollowing?: boolean;
}
