import { WithdrawalStatus } from "@domain/enum/WithdrawalStatus";

export interface PopulatedUser {
  _id: string;
  userName: string;
  profileImg?: string;
}

export interface PopulatedProject {
  _id: string;
  startupName: string;
  logoUrl?: string;
  userId: PopulatedUser;
}

export interface PopulatedWithdrawal {
  _id: string;
  amount: number;
  requestReason: string;
  rejectionReason?: string;
  status: WithdrawalStatus;
  createdAt: Date;

  projectId: PopulatedProject;
}
