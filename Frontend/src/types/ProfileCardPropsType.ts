import type { UserRole } from "./UserRole";

export interface ProfileCardProps {
  isOwnProfile: boolean;
  userData: {
    id: string;
    userName: string;
    bio?: string;
    role: UserRole;
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
  isInvestorProfile?: boolean;
  isFollowing: boolean;
  onFollow: () => void;
}
