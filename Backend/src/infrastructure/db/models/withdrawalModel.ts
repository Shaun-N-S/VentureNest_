import { Document, model } from "mongoose";
import withdrawalSchema from "../schema/withdrawalSchema";
import { WithdrawalStatus } from "@domain/enum/WithdrawalStatus";

export interface IWithdrawalModel extends Document {
  _id: string;
  projectId: string;
  walletId: string;
  amount: number;
  reason: string;
  status: WithdrawalStatus;
  createdAt: Date;
  processedAt?: Date;
}

export const withdrawalModel = model<IWithdrawalModel>("Withdrawal", withdrawalSchema);
