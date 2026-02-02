import mongoose from "mongoose";
import { SessionStatus } from "@domain/enum/sessionStatus";
import { SessionCancelledBy } from "@domain/enum/sessionCancelledBy";

const sessionSchema = new mongoose.Schema(
  {
    ticketId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    investorId: { type: mongoose.Schema.Types.ObjectId, required: true },
    founderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, required: true },

    sessionName: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: Date },
    duration: { type: Number, required: true },

    status: {
      type: String,
      enum: Object.values(SessionStatus),
      default: SessionStatus.SCHEDULED,
    },

    cancelledBy: {
      type: String,
      enum: Object.values(SessionCancelledBy),
    },
    cancelReason: { type: String },

    feedback: { type: String },
  },
  { timestamps: true }
);

sessionSchema.index({ ticketId: 1, date: 1 });

export default sessionSchema;
