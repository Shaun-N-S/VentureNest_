import type { Plan } from "./planType";

export type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "EXPIRED";

export interface CurrentSubscription {
  subscriptionId: string;
  status: SubscriptionStatus;
  startedAt: string;
  expiresAt: string;
  plan: Plan;
}
