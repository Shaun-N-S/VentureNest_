import mongoose from "mongoose";
import { WalletOwnerType } from "@domain/enum/walletOwnerType";

const walletSchema = new mongoose.Schema(
  {
    ownerType: {
      type: String,
      enum: Object.values(WalletOwnerType),
      required: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    balance: { type: Number, default: 0 },
    lockedBalance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

walletSchema.index({ ownerType: 1, ownerId: 1 }, { unique: true });

export default walletSchema;
