import { ISubscriptionRepository } from "@domain/interfaces/repositories/ISubscriptionRepository";
import { SubscriptionAction } from "@domain/enum/subscriptionActions";
import { SubscriptionUsageMap } from "application/constants/subscriptionUsageMap";
import { UserRole } from "@domain/enum/userRole";
import { IIncrementSubscriptionUsageUseCase } from "@domain/interfaces/useCases/subscription/ICheckSubscriptionUsageUseCase";

export class IncrementSubscriptionUsageUseCase implements IIncrementSubscriptionUsageUseCase {
  constructor(private _subscriptionRepo: ISubscriptionRepository) {}

  async execute(ownerId: string, ownerRole: UserRole, action: SubscriptionAction): Promise<void> {
    const field = SubscriptionUsageMap[action];

    if (!field) return;

    await this._subscriptionRepo.incrementUsage(ownerId, ownerRole, field);
  }
}
