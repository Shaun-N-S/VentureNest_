import { WithdrawalStatus } from "@domain/enum/WithdrawalStatus";

export interface GetWithdrawalsRequestDTO {
  status?: WithdrawalStatus;
  projectId?: string;
  search?: string;
  page: number;
  limit: number;
}

export interface FounderDTO {
  userName: string;
  profileImg?: string | undefined;
}

export interface ProjectDTO {
  startupName: string;
  logoUrl?: string | undefined;
  founder: FounderDTO | null;
}

export interface WithdrawalListItemDTO {
  withdrawalId: string;
  amount: number;
  status: WithdrawalStatus;
  requestReason: string;
  rejectionReason?: string;
  createdAt: Date;
  project: ProjectDTO | null;
}

export interface GetWithdrawalsResponseDTO {
  data: WithdrawalListItemDTO[];
  total: number;
  page: number;
  limit: number;
}
