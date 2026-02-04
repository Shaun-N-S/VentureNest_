import { TransactionStatus } from "@domain/enum/transactionStatus";
import { TransactionType } from "@domain/enum/transactionType";

export interface TransactionEntity {
  _id?: string;

  fromWalletId: string;
  toWalletId: string;

  relatedDealId?: string;

  amount: number;
  type: TransactionType;
  status: TransactionStatus;

  createdAt?: Date;
}
