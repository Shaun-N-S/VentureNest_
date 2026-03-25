export interface GetProjectWithdrawalsRequestDTO {
  projectId: string;
  page: number;
  limit: number;
}

export interface ProjectWithdrawalItemDTO {
  withdrawalId: string;
  amount: number;
  status: string;
  reason: string;
  createdAt: Date;
}

export interface GetProjectWithdrawalsResponseDTO {
  data: ProjectWithdrawalItemDTO[];
  total: number;
  page: number;
  limit: number;
}
