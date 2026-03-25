import { walletModel } from "@infrastructure/db/models/walletModel";
import { WalletRepository } from "@infrastructure/repostiories/walletRepository";
import { StripePaymentService } from "@infrastructure/services/Stripe/stripePaymentService";
import { CreateWalletTopupCheckoutUseCase } from "application/useCases/Wallet/createWalletTopupCheckoutUseCase";
import { GetWalletDetailsUseCase } from "application/useCases/Wallet/getWalletDetailsUseCase";
import { WalletController } from "interfaceAdapters/controller/Wallet/walletController";
import { PlatformInitializationService } from "../../../infrastructure/services/platformInitializationService";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { userModel } from "@infrastructure/db/models/userModel";
import { RequestWithdrawalUseCase } from "application/useCases/Wallet/requestWithdrawalUseCase";
import { projectModel } from "@infrastructure/db/models/projectModel";
import { ProjectRepository } from "@infrastructure/repostiories/projectRepository";
import { withdrawalModel } from "@infrastructure/db/models/withdrawalModel";
import { WithdrawalRepository } from "@infrastructure/repostiories/withdrawalRepository";
import { MongooseUnitOfWork } from "@infrastructure/db/connectDB/MongooseUnitOfWork";
import { GetProjectWithdrawalsUseCase } from "application/useCases/Wallet/getProjectWithdrawalsUseCase";
import { CreateStripeAccountUseCase } from "application/useCases/Stripe/createStripeAccountUseCase";
import { GetStripeOnboardingLinkUseCase } from "application/useCases/Stripe/getStripeOnboardingLinkUseCase";
import { WithdrawToBankUseCase } from "application/useCases/Stripe/withdrawToBankUseCase";
import { StripeConnectService } from "@infrastructure/services/Stripe/stripeConnectService";
import { TransactionRepository } from "@infrastructure/repostiories/transactionRepository";
import { transactionModel } from "@infrastructure/db/models/transactionModel";

const walletRepo = new WalletRepository(walletModel);
const userRepo = new UserRepository(userModel);
const projectRepo = new ProjectRepository(projectModel);
const paymentService = new StripePaymentService();
const withdrawalRepo = new WithdrawalRepository(withdrawalModel);
const transactionRepo = new TransactionRepository(transactionModel);
const unitOfWork = new MongooseUnitOfWork();
const stripeService = new StripeConnectService();

const getWalletDetailsUseCase = new GetWalletDetailsUseCase(walletRepo);
const createWalletTopupCheckoutUseCase = new CreateWalletTopupCheckoutUseCase(paymentService);
const requestWithdrawalUseCase = new RequestWithdrawalUseCase(
  walletRepo,
  projectRepo,
  withdrawalRepo,
  unitOfWork
);
const getProjectWithdrawalsUseCase = new GetProjectWithdrawalsUseCase(withdrawalRepo, projectRepo);
const createStripeAccountUseCase = new CreateStripeAccountUseCase(userRepo, stripeService);
const getStripeOnboardingLinkUseCase = new GetStripeOnboardingLinkUseCase(userRepo, stripeService);
const withdrawToBankUseCase = new WithdrawToBankUseCase(
  walletRepo,
  userRepo,
  transactionRepo,
  stripeService,
  unitOfWork
);

export const walletController = new WalletController(
  getWalletDetailsUseCase,
  createWalletTopupCheckoutUseCase,
  requestWithdrawalUseCase,
  getProjectWithdrawalsUseCase,
  createStripeAccountUseCase,
  getStripeOnboardingLinkUseCase,
  withdrawToBankUseCase
);
export const platformInitializationService = new PlatformInitializationService(
  walletRepo,
  userRepo
);
