export type TransactionAction = "CREDIT" | "DEBIT" | "TRANSFER";

export interface Transaction {
  _id: string;
  fromWalletId?: string;
  toWalletId?: string;
  amount: number;
  action: TransactionAction;
  reason: string;
  status: string;
  createdAt: string;
}

export type TransactionReason =
  | "WALLET_TOPUP"
  | "SUBSCRIPTION"
  | "INVESTMENT"
  | "WITHDRAWAL"
  | "REFUND"
  | "PLATFORM_FEE";

export type TransactionStatus = "SUCCESS" | "PENDING" | "FAILED";

export interface Transactions {
  _id: string;
  amount: number;
  action: TransactionAction;
  reason: TransactionReason;
  status: TransactionStatus;
  createdAt: string;

  fromWalletId?: string;
  toWalletId?: string;
}
