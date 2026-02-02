import { PaymentModel } from "@infrastructure/db/models/paymentModel";
import { planModel } from "@infrastructure/db/models/planModel";
import { SubscriptionModel } from "@infrastructure/db/models/subscriptionModel";
import { PaymentRepository } from "@infrastructure/repostiories/paymentRepository";
import { PlanRepository } from "@infrastructure/repostiories/planRepository";
import { SubscriptionRepository } from "@infrastructure/repostiories/subscriptionRepository";
import { HandleCheckoutCompletedUseCase } from "application/useCases/Payment/handleCheckoutCompletedUseCase";
import { WebhookController } from "interfaceAdapters/controller/Webhook/webhookController";

const paymentRepo = new PaymentRepository(PaymentModel);
const subscriptionRepo = new SubscriptionRepository(SubscriptionModel);
const planRepo = new PlanRepository(planModel);

const handleCheckoutCompletedUC = new HandleCheckoutCompletedUseCase(
  paymentRepo,
  subscriptionRepo,
  planRepo
);

export const webhookController = new WebhookController(handleCheckoutCompletedUC);
