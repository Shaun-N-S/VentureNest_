import mongoose from "mongoose";
import { OfferStatus } from "@domain/enum/offerStatus";
import { UserRole } from "@domain/enum/userRole";

const investmentOfferSchema = new mongoose.Schema(
  {
    pitchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pitch",
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    investorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investor",
      required: true,
    },
    founderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: { type: Number, required: true },
    equityPercentage: { type: Number, required: true },
    valuation: { type: Number },

    terms: { type: String, required: true },
    note: { type: String },

    status: {
      type: String,
      enum: Object.values(OfferStatus),
      default: OfferStatus.PENDING,
      index: true,
    },

    expiresAt: { type: Date },
    respondedAt: { type: Date },
    respondedBy: {
      type: String,
      enum: Object.values(UserRole),
    },

    rejectionReason: { type: String },
  },
  { timestamps: true }
);

export default investmentOfferSchema;
