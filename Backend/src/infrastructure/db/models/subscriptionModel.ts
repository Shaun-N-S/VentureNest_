import { Document, model } from "mongoose";
import subscriptionSchema from "../schema/subscriptionSchema";
import { SubscriptionStatus } from "@domain/enum/subscriptionStatus";

export interface ISubscriptionModel extends Document {
  _id: string;

  userId: string;
  planId: string;

  startedAt: Date;
  expiresAt: Date;

  status: SubscriptionStatus;

  usage: {
    messagesUsed: number;
    consentLettersUsed: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

export const subscriptionModel = model<ISubscriptionModel>("Subscription", subscriptionSchema);
