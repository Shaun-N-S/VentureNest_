import { SubscriptionAction } from "@domain/enum/subscriptionActions";

export const SubscriptionUsageMap = {
  [SubscriptionAction.CREATE_PROJECT]: "projectsUsed",
  [SubscriptionAction.SEND_PROPOSAL]: "proposalsUsed",
  [SubscriptionAction.SEND_INVESTMENT_OFFER]: "investmentOffersUsed",
};
