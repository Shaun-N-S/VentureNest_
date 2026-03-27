import { WithdrawalStatus } from "@domain/enum/WithdrawalStatus";

export interface WithdrawalEntity {
  _id?: string;

  projectId: string;
  walletId: string;

  amount: number;
  requestReason: string;
  rejectionReason?: string;

  status: WithdrawalStatus;

  createdAt?: Date;
  processedAt?: Date;
}
