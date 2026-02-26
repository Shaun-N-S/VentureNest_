import { dealModel } from "@infrastructure/db/models/dealModel";
import { PaymentModel } from "@infrastructure/db/models/paymentModel";
import { transactionModel } from "@infrastructure/db/models/transactionModel";
import { DealRepository } from "@infrastructure/repostiories/dealRepository";
import { PaymentRepository } from "@infrastructure/repostiories/paymentRepository";
import { TransactionRepository } from "@infrastructure/repostiories/transactionRepository";
import { GetAdminFinanceSummaryUseCase } from "application/useCases/Admin/finance/getAdminFinanceSummaryUseCase";
import { GetAdminTransactionsUseCase } from "application/useCases/Admin/transactions/getAdminTransactionsUseCase";
import { AdminFinanceController } from "interfaceAdapters/controller/Admin/adminFinanceController";

const transactionRepo = new TransactionRepository(transactionModel);
const dealRepo = new DealRepository(dealModel);
const paymentRepo = new PaymentRepository(PaymentModel);

const getAdminTransactionUseCase = new GetAdminTransactionsUseCase(transactionRepo);
const getAdminFinanceSmmaryUseCase = new GetAdminFinanceSummaryUseCase(
  transactionRepo,
  dealRepo,
  paymentRepo
);

export const adminFinanceController = new AdminFinanceController(
  getAdminTransactionUseCase,
  getAdminFinanceSmmaryUseCase
);
