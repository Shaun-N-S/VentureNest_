import { SubscriptionStatus } from "@domain/enum/subscriptionStatus";

export interface SubscriptionDTO {
  _id: string;
  planId: string;

  startedAt: Date;
  expiresAt: Date;
  status: SubscriptionStatus;

  usage: {
    messagesUsed: number;
    consentLettersUsed: number;
  };

  createdAt?: Date;
}
