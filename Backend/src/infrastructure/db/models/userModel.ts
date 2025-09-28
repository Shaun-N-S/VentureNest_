import { Document, model } from "mongoose";
import { PreferredSector } from "domain/enum/preferredSector";
import { UserRole } from "domain/enum/userRole";
import { UserStatus } from "domain/enum/userStatus";
import userSchema from "../schema/userSchema";

export interface IUserModel extends Document {
  _id: string;
  userName: string;
  email: string;
  password: string;
  isFirstLogin: boolean;
  linkedInUrl?: string;
  profileImg?: string;
  website?: string;
  bio?: string;
  interestedTopics: PreferredSector[];
  role: UserRole;
  status: UserStatus;
  adminVerified: boolean;
  dateOfBirth?: Date;
  phoneNumber?: string;
  address?: string;
  aadharImg?: string;
  selfieImg?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const userModel = model<IUserModel>("User", userSchema);
