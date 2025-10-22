import { PreferredSector } from "@domain/enum/preferredSector";
import { StartupStage } from "@domain/enum/startupStages";
import { UserRole } from "@domain/enum/userRole";
import { UserStatus } from "@domain/enum/userStatus";
import mongoose from "mongoose";

const investorSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isFirstLogin: { type: Boolean, default: true },
    linkedInUrl: { type: String },
    profileImg: { type: String },
    website: { type: String },
    bio: { type: String },

    interestedTopics: [{ type: String, enum: Object.values(PreferredSector) }],

    role: { type: String, enum: Object.values(UserRole), default: UserRole.INVESTOR },

    status: { type: String, enum: Object.values(UserStatus), default: UserStatus.ACTIVE },

    location: { type: String },
    companyName: { type: String },
    experience: { type: Number },

    preferredSector: [{ type: String, enum: Object.values(PreferredSector) }],

    preferredStartupStage: [{ type: String, enum: Object.values(StartupStage) }],

    investmentMin: { type: Number },
    investmentMax: { type: Number },

    portfolioPdf: { type: String },

    adminVerified: { type: Boolean, default: false },
    aadharImg: { type: String },
    address: { type: String },
    dateOfBirth: { type: Date },
    phoneNumber: { type: String },
    selfieImg: { type: String },
    verifiedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default investorSchema;
