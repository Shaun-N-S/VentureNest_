import mongoose from "mongoose";
import { TransactionType } from "@domain/enum/transactionType";
import { TransactionStatus } from "@domain/enum/transactionStatus";

const transactionSchema = new mongoose.Schema(
  {
    fromWalletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    toWalletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },

    relatedDealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
    },

    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
  },
  { timestamps: true }
);

export default transactionSchema;
