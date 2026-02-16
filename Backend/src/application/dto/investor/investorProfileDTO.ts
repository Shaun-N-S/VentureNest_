import { KYCStatus } from "@domain/enum/kycStatus";
import { UserRole } from "@domain/enum/userRole";

export interface InvestorProfileDTO {
  _id: string;
  userName?: string;
  profileImg?: string;
  bio?: string;
  role: UserRole;
  website?: string;
  companyName?: string;
  experience?: number;
  location?: string;
  investmentMin?: number;
  investmentMax?: number;
  adminVerified?: boolean;
  linkedInUrl?: string;
  kycStatus?: KYCStatus;
  kycRejectReason?: string;
  connectionsCount?: number;
  postCount?: number;
  investmentCount?: number;
}

export interface InvestorProfileUpdateFormDataDTO {
  userName?: string;
  bio?: string;
  website?: string;
  companyName?: string;
  experience?: number;
  location?: string;
  investmentMin?: number;
  investmentMax?: number;
}

export interface InvestorProfileUpdateDTO {
  id: string;
  profileImg?: File;
  formData: InvestorProfileUpdateFormDataDTO;
}

export interface InvestorProfileUpdateResDTO {
  userName?: string;
  bio?: string;
  website?: string;
  linkedInUrl?: string;
  companyName?: string;
  adminVerified?: boolean;
  profileImg?: string;
  kycRejectReason?: string;
}
