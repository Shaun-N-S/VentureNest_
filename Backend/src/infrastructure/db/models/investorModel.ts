import { PreferredSector } from "@domain/enum/preferredSector";
import { StartupStage } from "@domain/enum/startupStages";
import { UserRole } from "@domain/enum/userRole";
import { UserStatus } from "@domain/enum/userStatus";
import { Document, model } from "mongoose";
import investorSchema from "../schema/investorSchema";
import { KYCStatus } from "@domain/enum/kycStatus";

export interface IInvestorModel extends Document {
  _id: string;
  userName: string;
  email: string;
  password: string;
  linkedInUrl?: string;
  profileImg?: string;
  website?: string;
  bio?: string;
  interestedTopics: PreferredSector[];
  role: UserRole;
  status: UserStatus;
  kycStatus: KYCStatus;
  adminVerified: boolean;
  dateOfBirth: Date;
  phoneNumber?: string;
  address?: string;
  aadharImg?: string;
  selfieImg?: string;
  isFirstLogin: boolean;
  verifiedAt: Date;
  createdAt: Date;
  updatedAt: Date;

  // Investor-specific
  location?: string;
  companyName?: string;
  experience?: number;
  preferredSector: PreferredSector[];
  preferredStartupStage: StartupStage[];
  investmentMin?: number;
  investmentMax?: number;
  portfolioPdf?: string;
}

export const investorModel = model<IInvestorModel>("Investor", investorSchema);
