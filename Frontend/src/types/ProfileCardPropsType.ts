export interface ProfileCardProps {
  userData: {
    userName: string;
    bio?: string;
    website?: string;
    profileImg?: string;
    linkedInUrl?: string;

    adminVerified?: boolean;
    kycStatus?: "PENDING" | "APPROVED" | "REJECTED" | "SUBMITTED";
    kycRejectReason?: string;

    postCount?: number;
    projectCount?: number;
    connectionsCount?: number;
    investmentCount?: number;
  };
  isFollowing: boolean;
  onFollow: () => void;
}
