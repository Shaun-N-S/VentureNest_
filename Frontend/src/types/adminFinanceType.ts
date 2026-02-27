export interface AdminTransaction {
  id: string;
  amount: number;
  action: "CREDIT" | "DEBIT" | "TRANSFER";
  reason: "PLATFORM_FEE" | "INVESTMENT" | string;
  status: "SUCCESS" | "PENDING" | "FAILED";
  createdAt: string;
  relatedDealId?: string;
  toWalletId?: string;
}

export interface AdminTransactionsResponse {
  transactions: AdminTransaction[];
  total: number;
}

export interface AdminPlatformWallet {
  walletId: string;
  balance: number;
  lockedBalance: number;
  totalAvailableBalance: number;
}
