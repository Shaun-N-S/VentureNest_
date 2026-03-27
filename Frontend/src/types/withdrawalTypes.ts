export interface Withdrawal {
  withdrawalId: string;
  amount: number;
  status: string;
  requestReason: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface ProjectWithdrawalResponse {
  data: Withdrawal[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminWithdrawal {
  withdrawalId: string;
  projectId: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface AdminWithdrawalResponse {
  data: AdminWithdrawal[];
  total: number;
  page: number;
  limit: number;
}

export type WithdrawalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface GetWithdrawalsResponse {
  data: WithdrawalListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface Founder {
  userName: string;
  profileImg?: string;
}

export interface Project {
  startupName: string;
  logoUrl?: string;
  founder: Founder | null;
}

export interface WithdrawalListItem {
  withdrawalId: string;
  amount: number;
  status: WithdrawalStatus;
  createdAt: string;
  requestReason: string;
  rejectionReason?: string;
  project: Project | null;
}
