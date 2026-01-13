import { SubscriptionEntity } from "@domain/entities/subscription/subscriptionEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface ISubscriptionRepository extends IBaseRepository<SubscriptionEntity> {
  findActiveByUserId(userId: string): Promise<SubscriptionEntity | null>;
  cancelSubscription(userId: string): Promise<SubscriptionEntity | null>;
}
