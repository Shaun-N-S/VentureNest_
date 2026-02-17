import { TransactionStatus } from "@domain/enum/transactionStatus";
import { TransactionAction, TransactionReason } from "@domain/enum/transactionType";
import { UserRole } from "@domain/enum/userRole";

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

export interface GetWalletTransactionsRequestDTO {
  ownerId: string;
  ownerRole: UserRole;
  action?: TransactionAction;
}
