import mongoose from "mongoose";
import { DealInstallmentStatus } from "@domain/enum/dealInstallmentStatus";

const dealInstallmentSchema = new mongoose.Schema(
  {
    dealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    platformFee: {
      type: Number,
      required: true,
    },

    founderReceives: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(DealInstallmentStatus),
      default: DealInstallmentStatus.PAID,
    },
  },
  { timestamps: true }
);

export default dealInstallmentSchema;
