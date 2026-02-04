import mongoose from "mongoose";
import { TicketStage } from "@domain/enum/ticketStage";
import { TicketStatus } from "@domain/enum/ticketStatus";

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, required: true, unique: true },

    investorId: { type: mongoose.Schema.Types.ObjectId, ref: "Investor", required: true },
    founderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },

    companyName: { type: String },

    currentStage: {
      type: String,
      enum: Object.values(TicketStage),
      default: TicketStage.EXPLORATORY,
    },

    overallStatus: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.PROCEED,
    },
  },
  { timestamps: true }
);

ticketSchema.virtual("sessions", {
  ref: "Session",
  localField: "_id",
  foreignField: "ticketId",
});

ticketSchema.set("toObject", { virtuals: true });
ticketSchema.set("toJSON", { virtuals: true });

export default ticketSchema;
