import { WithdrawalStatus } from "@domain/enum/WithdrawalStatus";
import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    walletId: { type: mongoose.Schema.Types.ObjectId, required: true },

    amount: { type: Number, required: true },
    reason: { type: String, required: true },

    status: {
      type: String,
      enum: Object.values(WithdrawalStatus),
      required: true,
    },

    processedAt: { type: Date },
  },
  { timestamps: true }
);

export default withdrawalSchema;
