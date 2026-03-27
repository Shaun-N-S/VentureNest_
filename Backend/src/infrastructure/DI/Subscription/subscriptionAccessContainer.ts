import { SubscriptionModel } from "@infrastructure/db/models/subscriptionModel";
import { planModel } from "@infrastructure/db/models/planModel";
import { SubscriptionRepository } from "@infrastructure/repostiories/subscriptionRepository";
import { PlanRepository } from "@infrastructure/repostiories/planRepository";
import { CheckSubscriptionAccessUseCase } from "application/useCases/Subscription/checkSubscriptionAccessUseCase";

const subscriptionRepo = new SubscriptionRepository(SubscriptionModel);
const planRepo = new PlanRepository(planModel);

export const checkSubscriptionAccessUseCase = new CheckSubscriptionAccessUseCase(
  subscriptionRepo,
  planRepo
);
