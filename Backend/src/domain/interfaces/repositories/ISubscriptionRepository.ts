import { SubscriptionEntity } from "@domain/entities/subscription/subscriptionEntity";
import { IBaseRepository } from "./IBaseRepository";
import { UserRole } from "@domain/enum/userRole";

export interface ISubscriptionRepository extends IBaseRepository<SubscriptionEntity> {
  findActiveByOwner(ownerId: string, ownerRole: UserRole): Promise<SubscriptionEntity | null>;

  findLatestByOwner(ownerId: string, ownerRole: UserRole): Promise<SubscriptionEntity | null>;

  cancelSubscription(ownerId: string, ownerRole: UserRole): Promise<SubscriptionEntity | null>;

  expireSubscription(ownerId: string, ownerRole: UserRole): Promise<SubscriptionEntity | null>;
}
