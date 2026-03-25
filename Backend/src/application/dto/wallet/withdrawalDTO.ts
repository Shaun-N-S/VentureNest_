export interface RequestWithdrawalDTO {
  projectId: string;
  amount: number;
  reason: string;
}

export interface WithdrawalResponseDTO {
  withdrawalId: string;
  amount: number;
  status: string;
  createdAt: Date;
}
