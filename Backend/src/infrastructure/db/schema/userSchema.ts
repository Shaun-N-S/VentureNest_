import { PreferredSector } from "domain/enum/preferredSector";
import { UserRole } from "domain/enum/userRole";
import { UserStatus } from "domain/enum/userStatus";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    isFirstLogin: { type: Boolean, default: true },

    linkedInUrl: { type: String },
    profileImg: { type: String },
    website: { type: String },
    bio: { type: String },
    dateOfBirth: { type: Date },
    phoneNumber: { type: String, index: true },
    address: { type: String },

    interestedTopics: [
      {
        type: String,
        enum: Object.values(PreferredSector),
      },
    ],

    aadharImg: { type: String },
    selfieImg: { type: String },
    adminVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
  },
  { timestamps: true }
);

export default userSchema;
