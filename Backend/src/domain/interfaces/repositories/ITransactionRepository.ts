import { TransactionEntity } from "@domain/entities/Transaction/transactionEntity";
import { IBaseRepository } from "./IBaseRepository";
import { TransactionAction, TransactionReason } from "@domain/enum/transactionType";
import { ClientSession } from "mongoose";
import { TransactionStatus } from "@domain/enum/transactionStatus";

/**
 * Shape returned by `findAdminTransactions`. It is a transaction row enriched
 * with a resolved `displayName` (and related project name / entity type) via
 * aggregation `$lookup`s on existing collections — no new schema fields.
 * ObjectId fields are already stringified inside the pipeline.
 */
export interface AdminTransactionListItem {
  _id: string;
  fromWalletId: string | null;
  toWalletId: string | null;
  relatedDealId: string | null;
  amount: number;
  action: TransactionAction;
  reason: TransactionReason;
  status: TransactionStatus;
  createdAt: Date;
  displayName: string | null;
  relatedProjectName: string | null;
  relatedEntityType: "PROJECT" | "USER" | "INVESTOR" | "SYSTEM";
}

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
  ): Promise<AdminTransactionListItem[]>;

  countAdminTransactions(filters: {
    reason?: string;
    action?: string;
    status?: string;
    relatedDealId?: string;
  }): Promise<number>;

  sumByReason(reason: string): Promise<number>;

  findByRelatedPaymentId(paymentId: string): Promise<TransactionEntity | null>;

  updateStatus(id: string, status: TransactionStatus, session?: ClientSession): Promise<void>;

  findByWalletPaginated(
    walletId: string,
    action: TransactionAction | undefined,
    skip: number,
    limit: number
  ): Promise<TransactionEntity[]>;

  countByWallet(walletId: string, action?: TransactionAction): Promise<number>;

  getRevenueByReasonWithFilter(
    reason: TransactionReason,
    filter: {
      fromDate?: Date;
      toDate?: Date;
      year?: number;
      month?: number;
    }
  ): Promise<{ _id: number; total: number }[]>;
}
