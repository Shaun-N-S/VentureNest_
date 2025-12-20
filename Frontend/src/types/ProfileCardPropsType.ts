export interface ProfileCardProps {
  userData: {
    userName: string;
    bio?: string;
    website?: string;
    profileImg?: string;
    adminVerified?: boolean;
    linkedInUrl?: string;
    connectionsCount?: number;
    postCount?: number;
    projectCount?: number;
    investmentCount?: number;
  };
  isFollowing: boolean;
  onFollow: () => void;
}
