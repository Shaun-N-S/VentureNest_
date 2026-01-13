import mongoose from "mongoose";
import { SubscriptionStatus } from "@domain/enum/subscriptionStatus";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },

    startedAt: {
      type: Date,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.ACTIVE,
    },

    usage: {
      messagesUsed: {
        type: Number,
        default: 0,
      },
      consentLettersUsed: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

/**
 * One active subscription per user
 */
subscriptionSchema.index(
  { userId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "active" } }
);

export default subscriptionSchema;
