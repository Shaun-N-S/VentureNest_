import { MongooseUnitOfWork } from "@infrastructure/db/connectDB/MongooseUnitOfWork";
import { capTableModel } from "@infrastructure/db/models/capTableModel";
import { dealInstallmentModel } from "@infrastructure/db/models/dealInstallmentModel";
import { dealModel } from "@infrastructure/db/models/dealModel";
import { PaymentModel } from "@infrastructure/db/models/paymentModel";
import { planModel } from "@infrastructure/db/models/planModel";
import { projectRegistrationModel } from "@infrastructure/db/models/projectRegistrationModel";
import { shareIssuanceModel } from "@infrastructure/db/models/shareIssuanceModel";
import { SubscriptionModel } from "@infrastructure/db/models/subscriptionModel";
import { transactionModel } from "@infrastructure/db/models/transactionModel";
import { userModel } from "@infrastructure/db/models/userModel";
import { walletModel } from "@infrastructure/db/models/walletModel";
import { CapTableRepository } from "@infrastructure/repostiories/capTableRepository";
import { DealInstallmentRepository } from "@infrastructure/repostiories/dealInstallmentRepository";
import { DealRepository } from "@infrastructure/repostiories/dealRepository";
import { PaymentRepository } from "@infrastructure/repostiories/paymentRepository";
import { PlanRepository } from "@infrastructure/repostiories/planRepository";
import { ProjectRegistrationRepository } from "@infrastructure/repostiories/projectRegistrationRepository";
import { ShareIssuanceRepository } from "@infrastructure/repostiories/shareIssuanceRepository";
import { SubscriptionRepository } from "@infrastructure/repostiories/subscriptionRepository";
import { TransactionRepository } from "@infrastructure/repostiories/transactionRepository";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { WalletRepository } from "@infrastructure/repostiories/walletRepository";
import { EquityService } from "@infrastructure/services/EquityService";
import { HandleDealInstallmentStripeCompletedUseCase } from "application/useCases/Deal/handleDealInstallmentStripeCompletedUseCase";
import { HandleCheckoutCompletedUseCase } from "application/useCases/Payment/handleCheckoutCompletedUseCase";
import { HandleStripePayoutWebhookUseCase } from "application/useCases/Stripe/handleStripePayoutWebhookUseCase";
import { HandleWalletTopupCompletedUseCase } from "application/useCases/Wallet/handleWalletTopupCompletedUseCase";
import { WebhookController } from "interfaceAdapters/controller/Webhook/webhookController";

const paymentRepo = new PaymentRepository(PaymentModel);
const subscriptionRepo = new SubscriptionRepository(SubscriptionModel);
const planRepo = new PlanRepository(planModel);
const walletRepo = new WalletRepository(walletModel);
const transactionRepo = new TransactionRepository(transactionModel);
const dealRepo = new DealRepository(dealModel);
const dealInstallmentRepo = new DealInstallmentRepository(dealInstallmentModel);
const unitOfWork = new MongooseUnitOfWork();
const userRepo = new UserRepository(userModel);
const capRepo = new CapTableRepository(capTableModel);
const shareIssuanceRepo = new ShareIssuanceRepository(shareIssuanceModel);
const projectRegistrationRepo = new ProjectRegistrationRepository(projectRegistrationModel);
const equityService = new EquityService(
  capRepo,
  shareIssuanceRepo,
  dealRepo,
  projectRegistrationRepo
);

const handleCheckoutCompletedUC = new HandleCheckoutCompletedUseCase(
  paymentRepo,
  subscriptionRepo,
  planRepo,
  transactionRepo,
  walletRepo,
  userRepo
);
const handleWalletTopupCompletedUseCase = new HandleWalletTopupCompletedUseCase(
  walletRepo,
  paymentRepo,
  transactionRepo
);
const handleDealInstallmentStripeCompleteUseCase = new HandleDealInstallmentStripeCompletedUseCase(
  dealRepo,
  walletRepo,
  dealInstallmentRepo,
  transactionRepo,
  paymentRepo,
  unitOfWork,
  userRepo,
  equityService
);
const handleStripePayoutWebhookUseCase = new HandleStripePayoutWebhookUseCase(
  transactionRepo,
  walletRepo,
  unitOfWork
);

export const webhookController = new WebhookController(
  handleCheckoutCompletedUC,
  handleWalletTopupCompletedUseCase,
  handleDealInstallmentStripeCompleteUseCase,
  handleStripePayoutWebhookUseCase
);
