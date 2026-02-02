import mongoose from "mongoose";
import { SubscriptionStatus } from "@domain/enum/subscriptionStatus";
import { UserRole } from "@domain/enum/userRole";

const subscriptionSchema = new mongoose.Schema(
  {
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
      required: true,
    },

    startedAt: Date,
    expiresAt: {
      type: Date,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.ACTIVE,
      index: true,
    },

    usage: {
      projectsUsed: { type: Number, default: 0 },
      proposalsUsed: { type: Number, default: 0 },
      meetingRequestsUsed: { type: Number, default: 0 },
      investmentOffersUsed: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

subscriptionSchema.index(
  { ownerId: 1, ownerRole: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: SubscriptionStatus.ACTIVE },
  }
);

export default subscriptionSchema;
