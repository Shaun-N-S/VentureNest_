import mongoose from "mongoose";
import { TransactionStatus } from "@domain/enum/transactionStatus";
import { TransactionAction, TransactionReason } from "@domain/enum/transactionType";

const transactionSchema = new mongoose.Schema(
  {
    fromWalletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: false,
    },
    toWalletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: false,
    },

    relatedDealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
    },

    relatedPaymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },

    amount: {
      type: Number,
      required: true,
    },

    action: {
      type: String,
      enum: Object.values(TransactionAction),
      required: true,
    },

    reason: {
      type: String,
      enum: Object.values(TransactionReason),
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
