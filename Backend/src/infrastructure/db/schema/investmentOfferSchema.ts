import mongoose from "mongoose";
import { OfferStatus } from "@domain/enum/offerStatus";

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
    terms: { type: String, required: true },

    status: {
      type: String,
      enum: Object.values(OfferStatus),
      default: OfferStatus.PENDING,
    },
  },
  { timestamps: true }
);

export default investmentOfferSchema;
