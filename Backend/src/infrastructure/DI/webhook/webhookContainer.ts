import { PaymentModel } from "@infrastructure/db/models/paymentModel";
import { planModel } from "@infrastructure/db/models/planModel";
import { SubscriptionModel } from "@infrastructure/db/models/subscriptionModel";
import { transactionModel } from "@infrastructure/db/models/transactionModel";
import { walletModel } from "@infrastructure/db/models/walletModel";
import { PaymentRepository } from "@infrastructure/repostiories/paymentRepository";
import { PlanRepository } from "@infrastructure/repostiories/planRepository";
import { SubscriptionRepository } from "@infrastructure/repostiories/subscriptionRepository";
import { TransactionRepository } from "@infrastructure/repostiories/transactionRepository";
import { WalletRepository } from "@infrastructure/repostiories/walletRepository";
import { HandleCheckoutCompletedUseCase } from "application/useCases/Payment/handleCheckoutCompletedUseCase";
import { HandleWalletTopupCompletedUseCase } from "application/useCases/Wallet/handleWalletTopupCompletedUseCase";
import { WebhookController } from "interfaceAdapters/controller/Webhook/webhookController";

const paymentRepo = new PaymentRepository(PaymentModel);
const subscriptionRepo = new SubscriptionRepository(SubscriptionModel);
const planRepo = new PlanRepository(planModel);
const walletRepo = new WalletRepository(walletModel);
const transactionRepo = new TransactionRepository(transactionModel);

const handleCheckoutCompletedUC = new HandleCheckoutCompletedUseCase(
  paymentRepo,
  subscriptionRepo,
  planRepo
);
const handleWalletTopupCompletedUseCase = new HandleWalletTopupCompletedUseCase(
  walletRepo,
  paymentRepo,
  transactionRepo
);

export const webhookController = new WebhookController(
  handleCheckoutCompletedUC,
  handleWalletTopupCompletedUseCase
);
