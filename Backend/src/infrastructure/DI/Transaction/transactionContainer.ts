import { transactionModel } from "@infrastructure/db/models/transactionModel";
import { walletModel } from "@infrastructure/db/models/walletModel";
import { TransactionRepository } from "@infrastructure/repostiories/transactionRepository";
import { WalletRepository } from "@infrastructure/repostiories/walletRepository";
import { GetWalletTransactionsUseCase } from "application/useCases/Transaction/getWalletTransactionsUseCase";
import { TransactionController } from "interfaceAdapters/controller/Transaction/transactionController";

const walletRepo = new WalletRepository(walletModel);
const transactionRepo = new TransactionRepository(transactionModel);

const getWalletTransactionUseCase = new GetWalletTransactionsUseCase(walletRepo, transactionRepo);

export const transactionController = new TransactionController(getWalletTransactionUseCase);
