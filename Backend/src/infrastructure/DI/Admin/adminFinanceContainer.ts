import { transactionModel } from "@infrastructure/db/models/transactionModel";
import { TransactionRepository } from "@infrastructure/repostiories/transactionRepository";
import { GetAdminTransactionsUseCase } from "application/useCases/Admin/transactions/getAdminTransactionsUseCase";
import { AdminFinanceController } from "interfaceAdapters/controller/Admin/adminFinanceController";

const transactionRepo = new TransactionRepository(transactionModel);

const getAdminTransactionUseCase = new GetAdminTransactionsUseCase(transactionRepo);

export const adminFinanceController = new AdminFinanceController(getAdminTransactionUseCase);
