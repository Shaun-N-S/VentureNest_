import mongoose from "mongoose";
import { DealStatus } from "@domain/enum/dealStatus";

const dealSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InvestmentOffer",
      required: true,
      unique: true,
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

    totalAmount: { type: Number, required: true },

    amountPaid: {
      type: Number,
      default: 0,
    },

    remainingAmount: { type: Number, required: true },

    equityPercentage: { type: Number, required: true },

    status: {
      type: String,
      enum: Object.values(DealStatus),
      default: DealStatus.AWAITING_PAYMENT,
    },
  },
  { timestamps: true }
);

export default dealSchema;
