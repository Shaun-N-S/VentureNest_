import mongoose from "mongoose";
import { PreferredSector } from "@domain/enum/preferredSector";
import { StartupStage } from "@domain/enum/startupStages";
import { TeamSize } from "@domain/enum/teamSize";
import { ProjectRole } from "@domain/enum/projectRole";

const projectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startupName: { type: String, required: true },
    shortDescription: { type: String, required: true },
    pitchDeckUrl: { type: String },
    projectWebsite: { type: String },

    userRole: {
      type: String,
      enum: Object.values(ProjectRole),
      default: ProjectRole.TEAM_MEMBER,
    },

    teamSize: {
      type: String,
      enum: Object.values(TeamSize),
      required: true,
    },

    category: {
      type: String,
      enum: Object.values(PreferredSector),
      required: true,
    },

    stage: {
      type: String,
      enum: Object.values(StartupStage),
      required: true,
    },

    logoUrl: { type: String },
    coverImageUrl: { type: String },
    location: { type: String },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likeCount: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },

    walletId: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet" },

    donationEnabled: { type: Boolean, default: false },
    donationTarget: { type: Number, default: 0 },
    donationReceived: { type: Number, default: 0 },

    projectRegister: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default projectSchema;
