export interface InvestorProfileData {
  _id: string;
  userName: string;
  profileImg?: string;
  bio?: string;
  role: string;
  website?: string;
  companyName?: string;
  experience?: number;
  location?: string;
  investmentMin?: number;
  investmentMax?: number;
  adminVerified?: boolean;
  linkedInUrl?: string;
  kycStatus?: "PENDING" | "VERIFIED" | "REJECTED" | "SUBMITTED" | "APPROVED";
  kycRejectReason?: string;
  connectionsCount?: number;
  postCount?: number;
  investmentCount?: number;
  interestedTopics?: string[];
}

export interface InvestorProfileApiResponse {
  success: boolean;
  message: string;
  data: {
    profileData: InvestorProfileData;
  };
}
