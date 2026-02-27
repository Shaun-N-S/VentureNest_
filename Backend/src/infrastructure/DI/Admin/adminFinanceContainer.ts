import { dealModel } from "@infrastructure/db/models/dealModel";
import { PaymentModel } from "@infrastructure/db/models/paymentModel";
import { transactionModel } from "@infrastructure/db/models/transactionModel";
import { userModel } from "@infrastructure/db/models/userModel";
import { walletModel } from "@infrastructure/db/models/walletModel";
import { DealRepository } from "@infrastructure/repostiories/dealRepository";
import { PaymentRepository } from "@infrastructure/repostiories/paymentRepository";
import { TransactionRepository } from "@infrastructure/repostiories/transactionRepository";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { WalletRepository } from "@infrastructure/repostiories/walletRepository";
import { GetAdminFinanceSummaryUseCase } from "application/useCases/Admin/finance/getAdminFinanceSummaryUseCase";
import { GetAdminPlatformWalletUseCase } from "application/useCases/Admin/finance/getAdminPlatformWalletUseCase";
import { GetAdminTransactionsUseCase } from "application/useCases/Admin/transactions/getAdminTransactionsUseCase";
import { AdminFinanceController } from "interfaceAdapters/controller/Admin/adminFinanceController";

const transactionRepo = new TransactionRepository(transactionModel);
const dealRepo = new DealRepository(dealModel);
const paymentRepo = new PaymentRepository(PaymentModel);
const walletRepo = new WalletRepository(walletModel);
const userRepo = new UserRepository(userModel);

const getAdminTransactionUseCase = new GetAdminTransactionsUseCase(transactionRepo);
const getAdminFinanceSmmaryUseCase = new GetAdminFinanceSummaryUseCase(
  transactionRepo,
  dealRepo,
  paymentRepo
);
const getAdminPlatformWalletUseCase = new GetAdminPlatformWalletUseCase(walletRepo, userRepo);

export const adminFinanceController = new AdminFinanceController(
  getAdminTransactionUseCase,
  getAdminFinanceSmmaryUseCase,
  getAdminPlatformWalletUseCase
);
