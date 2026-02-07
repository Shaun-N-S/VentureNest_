import { TransactionEntity } from "@domain/entities/Transaction/transactionEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface ITransactionRepository extends IBaseRepository<TransactionEntity> {
  findByWallet(walletId: string): Promise<TransactionEntity[]>;
}
