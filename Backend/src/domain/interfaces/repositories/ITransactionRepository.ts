import { TransactionEntity } from "@domain/entities/Transaction/transactionEntity";
import { IBaseRepository } from "./IBaseRepository";
import { TransactionAction } from "@domain/enum/transactionType";

export interface ITransactionRepository extends IBaseRepository<TransactionEntity> {
  findByWallet(walletId: string, action?: TransactionAction): Promise<TransactionEntity[]>;
  findAdminTransactions(
    filters: {
      reason?: string;
      action?: string;
      status?: string;
      relatedDealId?: string;
    },
    skip: number,
    limit: number
  ): Promise<TransactionEntity[]>;

  countAdminTransactions(filters: {
    reason?: string;
    action?: string;
    status?: string;
    relatedDealId?: string;
  }): Promise<number>;

  sumByReason(reason: string): Promise<number>;
}
