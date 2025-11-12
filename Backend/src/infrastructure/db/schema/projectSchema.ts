import mongoose from "mongoose";
import { PreferredSector } from "@domain/enum/preferredSector";
import { StartupStage } from "@domain/enum/startupStages";
import { TeamSize } from "@domain/enum/teamSize";

const projectSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startup_name: { type: String, required: true },
    short_description: { type: String, required: true },
    pitch_deck_url: { type: String },
    project_website: { type: String },
    user_role: { type: String, required: true },
    team_size: {
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
    logo_url: { type: String },
    cover_image_url: { type: String },
    location: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    like_count: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
    wallet_id: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet" },
    donation_enabled: { type: Boolean, default: false },
    donation_target: { type: Number, default: 0 },
    donation_received: { type: Number, default: 0 },
    project_register: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default projectSchema;
