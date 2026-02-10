import { TransactionStatus } from "@domain/enum/transactionStatus";
import { TransactionAction, TransactionReason } from "@domain/enum/transactionType";

export interface TransactionEntity {
  _id?: string;

  fromWalletId?: string;
  toWalletId?: string;

  relatedDealId?: string;
  relatedPaymentId?: string;

  amount: number;

  action: TransactionAction;
  reason: TransactionReason;

  status: TransactionStatus;

  createdAt?: Date;
  updatedAt?: Date;
}
