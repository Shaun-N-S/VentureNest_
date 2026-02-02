import { SubscriptionStatus } from "@domain/enum/subscriptionStatus";
import { UserRole } from "@domain/enum/userRole";

export interface SubscriptionEntity {
  id?: string;

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

  createdAt?: Date;
  updatedAt?: Date;
}
