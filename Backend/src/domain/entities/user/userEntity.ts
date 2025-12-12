import { KYCStatus } from "@domain/enum/kycStatus";
import { PreferredSector } from "@domain/enum/preferredSector";
import { UserRole } from "@domain/enum/userRole";
import { UserStatus } from "@domain/enum/userStatus";

export interface UserEntity {
  _id?: string;
  userName: string;
  email: string;
  password?: string;
  isFirstLogin: boolean;
  interestedTopics: PreferredSector[];
  role: UserRole;
  status: UserStatus;
  kycStatus: KYCStatus;
  adminVerified: boolean;

  kycHistory?: {
    status: KYCStatus;
    reason?: string;
    date: Date;
  }[];
  kycRejectReason?: string;

  linkedInUrl?: string;
  profileImg?: string;
  website?: string;

  bio?: string;
  dateOfBirth?: Date | undefined;
  phoneNumber?: string;
  address?: string;
  aadharImg?: string;
  selfieImg?: string;
  verifiedAt?: Date | undefined;
  googleId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
