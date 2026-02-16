import { KYCStatus } from "@domain/enum/kycStatus";
import { UserRole } from "@domain/enum/userRole";

export interface UserProfileUpdateDTO {
  userName?: string;
  profileImg?: string;
  bio?: string;
  website?: string;
  linkedInUrl?: string;
}

export interface UserProfileUpdateModelDTO {
  userName?: string;
  bio?: string;
  website?: string;
  linkedInUrl?: string;
}

export interface UserProfileUpdateReqDTO {
  id: string;
  profileImg?: File;
  formData?: UserProfileUpdateModelDTO;
}

export interface UserProfileUpdateResDTO {
  userName?: string;
  bio?: string;
  profileImg?: string;
  website?: string;
  linkedInUrl?: string;
  kycRejectReason?: string;
  adminVerified?: boolean;
  kycStatus?: KYCStatus;
}

export interface UserProfileResDTO {
  _id: string;
  userName?: string;
  bio?: string;
  role: UserRole;
  profileImg?: string;
  website?: string;
  linkedInUrl?: string;
  kycRejectReason?: string;
  adminVerified?: boolean;
  kycStatus?: KYCStatus;
  postCount?: number;
  connectionsCount?: number;
  projectCount?: number;
}
