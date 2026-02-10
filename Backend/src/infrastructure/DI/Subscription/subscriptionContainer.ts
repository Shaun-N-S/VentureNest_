import { planModel } from "@infrastructure/db/models/planModel";
import { SubscriptionModel } from "@infrastructure/db/models/subscriptionModel";
import { PlanRepository } from "@infrastructure/repostiories/planRepository";
import { SubscriptionRepository } from "@infrastructure/repostiories/subscriptionRepository";
import { StripePaymentService } from "@infrastructure/services/Stripe/stripePaymentService";
import { CreateCheckoutSessionUseCase } from "application/useCases/Payment/createCheckoutSessionUseCase";
import { GetCurrentSubscriptionUseCase } from "application/useCases/Subscription/getCurrentSubscriptionUseCase";
import { SubscriptionController } from "interfaceAdapters/controller/Subscription/subscriptionController";

const planRepo = new PlanRepository(planModel);
const subscriptionRepo = new SubscriptionRepository(SubscriptionModel);
const paymentService = new StripePaymentService();

const createCheckoutSessionUseCase = new CreateCheckoutSessionUseCase(planRepo, paymentService);
const getCurrentSubscriptionUseCase = new GetCurrentSubscriptionUseCase(subscriptionRepo, planRepo);

export const subscriptionController = new SubscriptionController(
  createCheckoutSessionUseCase,
  getCurrentSubscriptionUseCase
);
