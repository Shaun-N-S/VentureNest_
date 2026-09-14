
export interface UserProfileData {
  _id: string;
  userName: string;
  bio?: string;
  role: string;
  profileImg?: string;
  website?: string;
  linkedInUrl?: string;
  kycRejectReason?: string;
  adminVerified: boolean;
  kycStatus: "PENDING" | "VERIFIED" | "REJECTED" | "SUBMITTED" | "APPROVED";
  postCount?: number;
  connectionsCount?: number;
  projectCount?: number;
  interestedTopics?: string[];
}

export interface UserProfileApiResponse {
  success: boolean;
  message: string;
  data: {
    profileData: UserProfileData;
  };
}
