export interface RequestWithdrawalDTO {
  projectId: string;
  amount: number;
  requestReason: string;
}

export interface WithdrawalResponseDTO {
  withdrawalId: string;
  amount: number;
  status: string;
  requestReason: string;
  rejectionReason?: string;
  createdAt: Date;
}
