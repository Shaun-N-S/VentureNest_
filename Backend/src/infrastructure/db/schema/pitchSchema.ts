import mongoose from "mongoose";
import { PitchStatus } from "@domain/enum/pitchStatus";

const pitchSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    founderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    investorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investor",
      required: true,
    },

    subject: { type: String, required: true },
    message: { type: String, required: true },

    investorReply: {
      message: { type: String },
      repliedAt: { type: Date },
    },

    status: {
      type: String,
      enum: Object.values(PitchStatus),
      default: PitchStatus.SENT,
    },
  },
  { timestamps: true }
);

export default pitchSchema;
