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
import { transactionModel } from "@infrastructure/db/models/transactionModel";
import { TransactionRepository } from "@infrastructure/repostiories/transactionRepository";
import { MongooseUnitOfWork } from "@infrastructure/db/connectDB/MongooseUnitOfWork";

const walletRepo = new WalletRepository(walletModel);
const userRepo = new UserRepository(userModel);
const projectRepo = new ProjectRepository(projectModel);
const paymentService = new StripePaymentService();
const withdrawalRepo = new WithdrawalRepository(withdrawalModel);
const transactionRepo = new TransactionRepository(transactionModel);
const unitOfWork = new MongooseUnitOfWork();

const getWalletDetailsUseCase = new GetWalletDetailsUseCase(walletRepo);
const createWalletTopupCheckoutUseCase = new CreateWalletTopupCheckoutUseCase(paymentService);
const requestWithdrawalUseCase = new RequestWithdrawalUseCase(
  walletRepo,
  projectRepo,
  withdrawalRepo,
  transactionRepo,
  unitOfWork
);

export const walletController = new WalletController(
  getWalletDetailsUseCase,
  createWalletTopupCheckoutUseCase,
  requestWithdrawalUseCase
);
export const platformInitializationService = new PlatformInitializationService(
  walletRepo,
  userRepo
);
