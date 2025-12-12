export interface UserProfileApiResponse {
  success: boolean;
  message: string;
  data: {
    userName: string;
    bio?: string;
    profileImg?: string;
    website?: string;
    linkedInUrl?: string;
    kycRejectReason?: string;
    adminVerified: boolean;
    kycStatus: "PENDING" | "VERIFIED" | "REJECTED";
  };
}
