import { planModel } from "@infrastructure/db/models/planModel";
import { PlanRepository } from "@infrastructure/repostiories/planRepository";
import { StripePaymentService } from "@infrastructure/services/Stripe/stripePaymentService";
import { CreateCheckoutSessionUseCase } from "application/useCases/Payment/createCheckoutSessionUseCase";
import { SubscriptionController } from "interfaceAdapters/controller/Subscription/subscriptionController";

const planRepo = new PlanRepository(planModel);
const paymentService = new StripePaymentService();

const createCheckoutSessionUseCase = new CreateCheckoutSessionUseCase(planRepo, paymentService);

export const subscriptionController = new SubscriptionController(createCheckoutSessionUseCase);
