import { KYCStatus } from "@domain/enum/kycStatus";
import { UserRole } from "@domain/enum/userRole";
import { UserStatus } from "@domain/enum/userStatus";

export interface KycDTO {
  _id: string;
  userName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  adminVerified: boolean;
  kycStatus: KYCStatus;

  profileImg?: string | undefined;
  selfieImg?: string | undefined;
  aadharImg?: string | undefined;
  website?: string | undefined;
  phoneNumber?: string | undefined;
  address?: string | undefined;
  dateOfBirth?: Date | string | undefined;
  linkedInUrl?: string | undefined;

  investmentMin?: number | undefined;
  investmentMax?: number | undefined;
  companyName?: string | undefined;
  location?: string | undefined;
}
