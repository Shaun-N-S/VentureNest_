export interface Withdrawal {
  withdrawalId: string;
  amount: number;
  status: string;
  createdAt: string;
  reason?: string;
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

export type WithdrawalStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface WithdrawalListItem {
  withdrawalId: string;
  projectId: string;
  amount: number;
  status: WithdrawalStatus;
  createdAt: string;
}

export interface GetWithdrawalsResponse {
  data: WithdrawalListItem[];
  total: number;
  page: number;
  limit: number;
}