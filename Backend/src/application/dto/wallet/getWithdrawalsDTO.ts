export interface GetWithdrawalsRequestDTO {
  status?: string;
  projectId?: string;
  page: number;
  limit: number;
}

export interface WithdrawalListItemDTO {
  withdrawalId: string;
  projectId: string;
  amount: number;
  status: string;
  createdAt: Date;
}

export interface GetWithdrawalsResponseDTO {
  data: WithdrawalListItemDTO[];
  total: number;
  page: number;
  limit: number;
}
