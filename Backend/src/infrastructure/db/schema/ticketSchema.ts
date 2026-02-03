import mongoose from "mongoose";
import { TicketStage } from "@domain/enum/ticketStage";
import { TicketStatus } from "@domain/enum/ticketStatus";

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, required: true, unique: true },

    investorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investor",
      required: true,
      index: true,
    },

    founderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    companyName: { type: String },

    stage: {
      type: String,
      enum: Object.values(TicketStage),
      default: TicketStage.EXPLORATORY,
    },

    status: {
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

ticketSchema.index({ investorId: 1, projectId: 1 });

export default ticketSchema;
