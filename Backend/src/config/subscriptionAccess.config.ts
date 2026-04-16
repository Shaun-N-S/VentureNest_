import { SubscriptionAction } from "@domain/enum/subscriptionActions";
import { SUBSCRIPTION_ERRORS } from "@shared/constants/error";

export const actionLimitMap: Partial<
  Record<
    SubscriptionAction,
    {
      usageKey: "projectsUsed" | "proposalsUsed" | "investmentOffersUsed";
      limitKey: "projects" | "proposalsPerMonth" | "investmentOffers";
      error: string;
    }
  >
> = {
  [SubscriptionAction.CREATE_PROJECT]: {
    usageKey: "projectsUsed",
    limitKey: "projects",
    error: SUBSCRIPTION_ERRORS.PROJECT_LIMIT_EXCEEDED,
  },
  [SubscriptionAction.SEND_PROPOSAL]: {
    usageKey: "proposalsUsed",
    limitKey: "proposalsPerMonth",
    error: SUBSCRIPTION_ERRORS.PROPOSAL_LIMIT_EXCEEDED,
  },
  [SubscriptionAction.SEND_INVESTMENT_OFFER]: {
    usageKey: "investmentOffersUsed",
    limitKey: "investmentOffers",
    error: SUBSCRIPTION_ERRORS.INVESTMENT_OFFER_LIMIT_EXCEEDED,
  },
};
