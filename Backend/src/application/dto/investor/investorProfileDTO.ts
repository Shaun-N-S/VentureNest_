import { KYCStatus } from "@domain/enum/kycStatus";

export interface InvestorProfileDTO {
  userName?: string;
  profileImg?: string;
  bio?: string;
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
