export interface GetAdminTransactionsRequestDTO {
  reason?: string;
  action?: string;
  status?: string;
  dealId?: string;
  page: number;
  limit: number;
}

export interface AdminTransactionDTO {
  id: string;
  fromWalletId?: string;
  toWalletId?: string;
  relatedDealId?: string;
  amount: number;
  action: string;
  reason: string;
  status: string;
  createdAt: Date;
}
