import { SubscriptionStatus } from "@domain/enum/subscriptionStatus";

export interface SubscriptionEntity {
  _id?: string;

  userId: string;
  planId: string;

  startedAt: Date;
  expiresAt: Date;

  status: SubscriptionStatus;

  usage: {
    messagesUsed: number;
    consentLettersUsed: number;
  };

  createdAt?: Date;
  updatedAt?: Date;
}
