import mongoose from "mongoose";
import { SessionStatus } from "@domain/enum/sessionStatus";
import { SessionCancelledBy } from "@domain/enum/sessionCancelledBy";
import { TicketStage } from "@domain/enum/ticketStage";
import { TicketStatus } from "@domain/enum/ticketStatus";

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

    stage: {
      type: String,
      enum: Object.values(TicketStage),
      required: true,
    },

    decision: {
      type: String,
      enum: Object.values(TicketStatus),
    },

    cancelledBy: {
      type: String,
      enum: Object.values(SessionCancelledBy),
    },

    cancelReason: String,
    feedback: String,
  },
  { timestamps: true }
);

export default sessionSchema;
