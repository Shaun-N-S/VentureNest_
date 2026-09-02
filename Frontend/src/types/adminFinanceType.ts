export interface AdminTransaction {
  id: string;
  amount: number;
  action: "CREDIT" | "DEBIT" | "TRANSFER";
  reason: "PLATFORM_FEE" | "INVESTMENT" | string;
  status: "SUCCESS" | "PENDING" | "FAILED";
  createdAt: string;
  relatedDealId?: string;
  toWalletId?: string;

  /** Resolved business name for the row; `null`/absent -> render "System". */
  displayName?: string | null;
  /** Related project name when applicable; otherwise `null`/absent. */
  relatedProjectName?: string | null;
  relatedEntityType?: "PROJECT" | "USER" | "INVESTOR" | "SYSTEM";
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
