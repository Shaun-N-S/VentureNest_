export interface GetProjectWithdrawalsRequestDTO {
  projectId: string;
  page: number;
  limit: number;
}

export interface ProjectWithdrawalItemDTO {
  withdrawalId: string;
  amount: number;
  status: string;
  requestReason: string;
  rejectionReason?: string;
  createdAt: Date;
}

export interface GetProjectWithdrawalsResponseDTO {
  data: ProjectWithdrawalItemDTO[];
  total: number;
  page: number;
  limit: number;
}

export interface FounderDTO {
  userName: string;
  profileImg?: string;
}

export interface ProjectDTO {
  startupName: string;
  logoUrl?: string;
  founder: FounderDTO | null;
}

export interface WithdrawalListItemDTO {
  withdrawalId: string;
  amount: number;
  status: string;
  createdAt: Date;
  project: ProjectDTO | null;
}

export interface GetWithdrawalsResponseDTO {
  data: WithdrawalListItemDTO[];
  total: number;
  page: number;
  limit: number;
}
