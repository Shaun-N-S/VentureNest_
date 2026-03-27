import { MongooseUnitOfWork } from "@infrastructure/db/connectDB/MongooseUnitOfWork";
import { dealModel } from "@infrastructure/db/models/dealModel";
import { PaymentModel } from "@infrastructure/db/models/paymentModel";
import { projectModel } from "@infrastructure/db/models/projectModel";
import { transactionModel } from "@infrastructure/db/models/transactionModel";
import { userModel } from "@infrastructure/db/models/userModel";
import { walletModel } from "@infrastructure/db/models/walletModel";
import { withdrawalModel } from "@infrastructure/db/models/withdrawalModel";
import { DealRepository } from "@infrastructure/repostiories/dealRepository";
import { PaymentRepository } from "@infrastructure/repostiories/paymentRepository";
import { ProjectRepository } from "@infrastructure/repostiories/projectRepository";
import { TransactionRepository } from "@infrastructure/repostiories/transactionRepository";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { WalletRepository } from "@infrastructure/repostiories/walletRepository";
import { WithdrawalRepository } from "@infrastructure/repostiories/withdrawalRepository";
import { GetAdminFinanceSummaryUseCase } from "application/useCases/Admin/finance/getAdminFinanceSummaryUseCase";
import { GetAdminPlatformWalletUseCase } from "application/useCases/Admin/finance/getAdminPlatformWalletUseCase";
import { GetAdminTransactionsUseCase } from "application/useCases/Admin/transactions/getAdminTransactionsUseCase";
import { ApproveWithdrawalUseCase } from "application/useCases/Admin/finance/withdrawal/approveWithdrawalUseCase";
import { RejectWithdrawalUseCase } from "application/useCases/Admin/finance/withdrawal/rejectWithdrawalUseCase";
import { AdminFinanceController } from "interfaceAdapters/controller/Admin/adminFinanceController";
import { AdminWithdrawalController } from "interfaceAdapters/controller/Admin/adminWithdrawalController";
import { GetWithdrawaluseCase } from "application/useCases/Admin/finance/withdrawal/getWithdrawalUseCase";
import { StorageService } from "@infrastructure/services/storageService";

const transactionRepo = new TransactionRepository(transactionModel);
const dealRepo = new DealRepository(dealModel);
const paymentRepo = new PaymentRepository(PaymentModel);
const walletRepo = new WalletRepository(walletModel);
const userRepo = new UserRepository(userModel);
const projectRepo = new ProjectRepository(projectModel);
const withdrawalRepo = new WithdrawalRepository(withdrawalModel);
const unitOfWork = new MongooseUnitOfWork();
const storageService = new StorageService();

const getAdminTransactionUseCase = new GetAdminTransactionsUseCase(transactionRepo);
const getAdminFinanceSmmaryUseCase = new GetAdminFinanceSummaryUseCase(
  transactionRepo,
  dealRepo,
  paymentRepo
);
const getAdminPlatformWalletUseCase = new GetAdminPlatformWalletUseCase(walletRepo, userRepo);
const approveWithdrawalUseCase = new ApproveWithdrawalUseCase(
  walletRepo,
  projectRepo,
  withdrawalRepo,
  transactionRepo,
  unitOfWork
);
const rejectWithdrawalUseCase = new RejectWithdrawalUseCase(withdrawalRepo, walletRepo, unitOfWork);
const getWithdrawalUseCase = new GetWithdrawaluseCase(withdrawalRepo, storageService);

export const adminFinanceController = new AdminFinanceController(
  getAdminTransactionUseCase,
  getAdminFinanceSmmaryUseCase,
  getAdminPlatformWalletUseCase
);

export const adminWithdrawalController = new AdminWithdrawalController(
  approveWithdrawalUseCase,
  rejectWithdrawalUseCase,
  getWithdrawalUseCase
);
