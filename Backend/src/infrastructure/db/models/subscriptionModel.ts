import subscriptionSchema from "../schema/subscriptionSchema";
import { Document, model } from "mongoose";
import { SubscriptionStatus } from "@domain/enum/subscriptionStatus";
import { UserRole } from "@domain/enum/userRole";

export interface ISubscriptionModel extends Document {
  ownerId: string;
  ownerRole: UserRole;
  planId: string;

  startedAt: Date;
  expiresAt: Date;

  status: SubscriptionStatus;

  usage?: {
    projectsUsed?: number;
    proposalsUsed?: number;
    meetingRequestsUsed?: number;
    investmentOffersUsed?: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

export const SubscriptionModel = model<ISubscriptionModel>("Subscription", subscriptionSchema);
