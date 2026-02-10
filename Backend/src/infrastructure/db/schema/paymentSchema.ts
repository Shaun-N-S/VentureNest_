import { PaymentPurpose } from "@domain/enum/paymentPurpose";
import { UserRole } from "@domain/enum/userRole";
import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    ownerRole: {
      type: String,
      enum: [UserRole.USER, UserRole.INVESTOR],
      required: true,
      index: true,
    },

    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: false,
    },

    purpose: {
      type: String,
      enum: Object.values(PaymentPurpose),
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default PaymentSchema;
