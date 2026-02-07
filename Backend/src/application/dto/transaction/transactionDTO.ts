import { TransactionStatus } from "@domain/enum/transactionStatus";
import { TransactionAction, TransactionReason } from "@domain/enum/transactionType";

export interface TransactionDTO {
  _id: string;
  fromWalletId?: string;
  toWalletId?: string;
  amount: number;
  action: TransactionAction;
  reason: TransactionReason;
  status: TransactionStatus;
  createdAt: Date;
}
