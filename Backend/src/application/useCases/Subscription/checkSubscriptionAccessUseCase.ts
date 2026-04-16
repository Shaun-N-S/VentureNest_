import { ICheckSubscriptionAccessUseCase } from "@domain/interfaces/useCases/subscription/ICheckSubscriptionAccessUseCase";
import { ISubscriptionRepository } from "@domain/interfaces/repositories/ISubscriptionRepository";
import { IPlanRepository } from "@domain/interfaces/repositories/IPlanRepository";
import { ForbiddenException } from "application/constants/exceptions";
import { SubscriptionAction } from "@domain/enum/subscriptionActions";
import { UserRole } from "@domain/enum/userRole";
import { SUBSCRIPTION_ERRORS } from "@shared/constants/error";
import { actionLimitMap } from "@config/subscriptionAccess.config";
import { mapUserRoleToPlanRole } from "application/mappers/roleMapper";

export class CheckSubscriptionAccessUseCase implements ICheckSubscriptionAccessUseCase {
  constructor(
    private _subscriptionRepo: ISubscriptionRepository,
    private _planRepo: IPlanRepository
  ) {}

  async execute(data: {
    ownerId: string;
    ownerRole: UserRole;
    action: SubscriptionAction;
  }): Promise<void> {
    const { ownerId, ownerRole, action } = data;

    const subscription = await this._subscriptionRepo.findActiveByOwner(ownerId, ownerRole);

    if (!subscription) {
      throw new ForbiddenException(SUBSCRIPTION_ERRORS.NO_ACTIVE_SUBSCRIPTION);
    }

    if (subscription.expiresAt && new Date(subscription.expiresAt) < new Date()) {
      throw new ForbiddenException(SUBSCRIPTION_ERRORS.SUBSCRIPTION_EXPIRED);
    }

    const plan = await this._planRepo.findById(subscription.planId);

    if (!plan) {
      throw new ForbiddenException(SUBSCRIPTION_ERRORS.INVALID_PLAN);
    }

    const expectedPlanRole = mapUserRoleToPlanRole(ownerRole);

    if (!expectedPlanRole || plan.role !== expectedPlanRole) {
      throw new ForbiddenException(SUBSCRIPTION_ERRORS.INVALID_PLAN);
    }

    if (!plan.permissions[action]) {
      throw new ForbiddenException(SUBSCRIPTION_ERRORS.ACTION_NOT_ALLOWED);
    }

    const limitConfig = actionLimitMap[action];

    if (limitConfig) {
      const used =
        subscription.usage?.[limitConfig.usageKey as keyof typeof subscription.usage] ?? 0;

      const limit = plan.limits[limitConfig.limitKey as keyof typeof plan.limits];

      if (limit !== undefined && limit !== -1 && used >= limit) {
        throw new ForbiddenException(limitConfig.error);
      }
    }
  }
}
