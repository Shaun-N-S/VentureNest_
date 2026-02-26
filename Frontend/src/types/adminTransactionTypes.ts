export interface AdminTransaction {
  id: string;
  fromWalletId?: string;
  toWalletId?: string;
  relatedDealId?: string;
  amount: number;
  action: string;
  reason: string;
  status: string;
  createdAt: string;
}

export interface AdminTransactionResponse {
  data: AdminTransaction[];
  total: number;
}
