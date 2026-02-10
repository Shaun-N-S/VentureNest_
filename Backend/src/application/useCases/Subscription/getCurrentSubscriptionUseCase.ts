import { UserRole } from "@domain/enum/userRole";
import { ISubscriptionRepository } from "@domain/interfaces/repositories/ISubscriptionRepository";
import { IPlanRepository } from "@domain/interfaces/repositories/IPlanRepository";
import { CurrentSubscriptionDTO } from "application/dto/subscription/currentSubscriptionDTO";
import { PlanMapper } from "application/mappers/planMapper";
import { IGetCurrentSubscriptionUseCase } from "@domain/interfaces/useCases/subscription/IGetCurrentSubscriptionUseCase";

export class GetCurrentSubscriptionUseCase implements IGetCurrentSubscriptionUseCase {
  constructor(
    private _subscriptionRepo: ISubscriptionRepository,
    private _planRepo: IPlanRepository
  ) {}

  async execute(ownerId: string, ownerRole: UserRole): Promise<CurrentSubscriptionDTO | null> {
    const subscription = await this._subscriptionRepo.findActiveByOwner(ownerId, ownerRole);

    if (!subscription) return null;

    const plan = await this._planRepo.findById(subscription.planId);
    if (!plan) return null;

    return {
      subscriptionId: subscription.id!,
      status: subscription.status,
      startedAt: subscription.startedAt,
      expiresAt: subscription.expiresAt,
      plan: PlanMapper.toDTO(plan),
    };
  }
}
