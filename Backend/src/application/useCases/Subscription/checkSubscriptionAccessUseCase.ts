import { ICheckSubscriptionAccessUseCase } from "@domain/interfaces/useCases/subscription/ICheckSubscriptionAccessUseCase";
import { ISubscriptionRepository } from "@domain/interfaces/repositories/ISubscriptionRepository";
import { IPlanRepository } from "@domain/interfaces/repositories/IPlanRepository";
import { ForbiddenException } from "application/constants/exceptions";
import { SubscriptionAction } from "@domain/enum/subscriptionActions";
import { UserRole } from "@domain/enum/userRole";
import { SUBSCRIPTION_ERRORS } from "@shared/constants/error";

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
    const subscription = await this._subscriptionRepo.findActiveByOwner(
      data.ownerId,
      data.ownerRole
    );

    if (!subscription) {
      throw new ForbiddenException(SUBSCRIPTION_ERRORS.NO_ACTIVE_SUBSCRIPTION);
    }

    const plan = await this._planRepo.findById(subscription.planId);
    if (!plan) {
      throw new ForbiddenException(SUBSCRIPTION_ERRORS.INVALID_PLAN);
    }

    // PERMISSION CHECK
    if (!plan.permissions[data.action]) {
      throw new ForbiddenException(SUBSCRIPTION_ERRORS.ACTION_NOT_ALLOWED);
    }

    // LIMIT CHECKS
    if (data.action === SubscriptionAction.CREATE_PROJECT) {
      const used = subscription.usage?.projectsUsed || 0;
      const limit = plan.limits.projects;

      if (limit !== -1 && used >= (limit || 0)) {
        throw new ForbiddenException(SUBSCRIPTION_ERRORS.PROJECT_LIMIT_EXCEEDED);
      }
    }

    if (data.action === SubscriptionAction.SEND_PROPOSAL) {
      const used = subscription.usage?.proposalsUsed || 0;
      const limit = plan.limits.proposalsPerMonth;

      if (limit !== -1 && used >= (limit || 0)) {
        throw new ForbiddenException(SUBSCRIPTION_ERRORS.PROPOSAL_LIMIT_EXCEEDED);
      }
    }

    if (data.action === SubscriptionAction.SEND_INVESTMENT_OFFER) {
      const used = subscription.usage?.investmentOffersUsed || 0;
      const limit = plan.limits.investmentOffers;

      if (limit !== -1 && used >= (limit || 0)) {
        throw new ForbiddenException(SUBSCRIPTION_ERRORS.INVESTMENT_OFFER_LIMIT_EXCEEDED);
      }
    }
  }
}
