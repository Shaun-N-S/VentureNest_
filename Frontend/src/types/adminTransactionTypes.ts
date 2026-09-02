import type {
  TransactionAction,
  TransactionReason,
  TransactionStatus,
} from "./transactionTypes";

export type AdminTransactionRelatedEntityType =
  | "PROJECT"
  | "USER"
  | "INVESTOR"
  | "SYSTEM";

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

  /** Resolved business name for the row; `null`/absent -> render "System". */
  displayName?: string | null;
  /** Related project name when applicable; otherwise `null`/absent. */
  relatedProjectName?: string | null;
  relatedEntityType?: AdminTransactionRelatedEntityType;
}

export interface AdminTransactionResponse {
  transactions: AdminTransaction[];
  totalTransactions: number;
  totalPages: number;
  currentPage: number;
}
