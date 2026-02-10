import { TransactionEntity } from "@domain/entities/Transaction/transactionEntity";
import { IBaseRepository } from "./IBaseRepository";
import { TransactionAction } from "@domain/enum/transactionType";

export interface ITransactionRepository extends IBaseRepository<TransactionEntity> {
  findByWallet(walletId: string, action?: TransactionAction): Promise<TransactionEntity[]>;
}
