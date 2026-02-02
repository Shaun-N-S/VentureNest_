import { SubscriptionStatus } from "@domain/enum/subscriptionStatus";

export interface SubscriptionDTO {
  id: string;
  planId: string;

  startedAt: Date;
  expiresAt: Date;

  status: SubscriptionStatus;

  createdAt: Date;
}
