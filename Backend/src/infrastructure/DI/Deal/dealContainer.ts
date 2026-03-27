import { MongooseUnitOfWork } from "@infrastructure/db/connectDB/MongooseUnitOfWork";
import { capTableModel } from "@infrastructure/db/models/capTableModel";
import { dealInstallmentModel } from "@infrastructure/db/models/dealInstallmentModel";
import { dealModel } from "@infrastructure/db/models/dealModel";
import { projectRegistrationModel } from "@infrastructure/db/models/projectRegistrationModel";
import { shareIssuanceModel } from "@infrastructure/db/models/shareIssuanceModel";
import { transactionModel } from "@infrastructure/db/models/transactionModel";
import { userModel } from "@infrastructure/db/models/userModel";
import { walletModel } from "@infrastructure/db/models/walletModel";
import { CapTableRepository } from "@infrastructure/repostiories/capTableRepository";
import { DealInstallmentRepository } from "@infrastructure/repostiories/dealInstallmentRepository";
import { DealRepository } from "@infrastructure/repostiories/dealRepository";
import { ProjectRegistrationRepository } from "@infrastructure/repostiories/projectRegistrationRepository";
import { ShareIssuanceRepository } from "@infrastructure/repostiories/shareIssuanceRepository";
import { TransactionRepository } from "@infrastructure/repostiories/transactionRepository";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { WalletRepository } from "@infrastructure/repostiories/walletRepository";
import { EquityService } from "@infrastructure/services/EquityService";
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
  unitOfWork,
  userRepo,
  equityService
);

export const dealController = new DealController(
  createDealInstallmentCheckoutUseCase,
  getMyDealsUseCase,
  getDealDetailsUseCase,
  getDealInstallmentUseCase,
  releaseDealInstallmentUseCase
);
