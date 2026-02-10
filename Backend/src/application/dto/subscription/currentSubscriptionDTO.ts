import { SubscriptionStatus } from "@domain/enum/subscriptionStatus";
import { PlanDTO } from "../plan/planDTO";

export interface CurrentSubscriptionDTO {
  subscriptionId: string;
  status: SubscriptionStatus;
  startedAt: Date;
  expiresAt: Date;
  plan: PlanDTO;
}
