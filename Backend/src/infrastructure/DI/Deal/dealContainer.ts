import { MongooseUnitOfWork } from "@infrastructure/db/connectDB/MongooseUnitOfWork";
import { dealInstallmentModel } from "@infrastructure/db/models/dealInstallmentModel";
import { dealModel } from "@infrastructure/db/models/dealModel";
import { transactionModel } from "@infrastructure/db/models/transactionModel";
import { walletModel } from "@infrastructure/db/models/walletModel";
import { DealInstallmentRepository } from "@infrastructure/repostiories/dealInstallmentRepository";
import { DealRepository } from "@infrastructure/repostiories/dealRepository";
import { TransactionRepository } from "@infrastructure/repostiories/transactionRepository";
import { WalletRepository } from "@infrastructure/repostiories/walletRepository";
import { StripePaymentService } from "@infrastructure/services/Stripe/stripePaymentService";
import { CreateDealInstallmentCheckoutUseCase } from "application/useCases/Deal/createDealInstallmentCheckoutUseCase";
import { GetDealDetailsUseCase } from "application/useCases/Deal/getDealDetailsUseCase";
import { GetDealInstallmentsUseCase } from "application/useCases/Deal/getDealInstallmentsUseCase";
import { GetMyDealsUseCase } from "application/useCases/Deal/getMyDealsUseCase";
import { ReleaseDealInstallmentUseCase } from "application/useCases/Deal/releaseDealInstallmentUseCase";
import { DealController } from "interfaceAdapters/controller/Deal/dealController";

const dealRepo = new DealRepository(dealModel);
const dealInstallmentRepo = new DealInstallmentRepository(dealInstallmentModel);
const paymentService = new StripePaymentService();
const walletRepo = new WalletRepository(walletModel);
const transactionRepo = new TransactionRepository(transactionModel);
const unitOfWork = new MongooseUnitOfWork();

const createDealInstallmentCheckoutUseCase = new CreateDealInstallmentCheckoutUseCase(
  dealRepo,
  paymentService
);
const getMyDealsUseCase = new GetMyDealsUseCase(dealRepo);
const getDealDetailsUseCase = new GetDealDetailsUseCase(dealRepo, dealInstallmentRepo);
const getDealInstallmentUseCase = new GetDealInstallmentsUseCase(dealRepo, dealInstallmentRepo);
const releaseDealInstallmentUseCase = new ReleaseDealInstallmentUseCase(
  dealRepo,
  walletRepo,
  dealInstallmentRepo,
  transactionRepo,
  unitOfWork
);

export const dealController = new DealController(
  createDealInstallmentCheckoutUseCase,
  getMyDealsUseCase,
  getDealDetailsUseCase,
  getDealInstallmentUseCase,
  releaseDealInstallmentUseCase
);
