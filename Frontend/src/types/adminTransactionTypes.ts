import type {
  TransactionAction,
  TransactionReason,
  TransactionStatus,
} from "./transactionTypes";

export interface AdminTransaction {
  id: string;
  fromWalletId?: string;
  toWalletId?: string;
  relatedDealId?: string;
  amount: number;
  action: TransactionAction;
  reason: TransactionReason;
  status: TransactionStatus;
  createdAt: string;
}

export interface AdminTransactionResponse {
  transactions: AdminTransaction[];
  totalTransactions: number;
  totalPages: number;
  currentPage: number;
}
