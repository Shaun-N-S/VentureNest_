import { Document, model } from "mongoose";
import transactionSchema from "../schema/transactionSchema";
import { TransactionType } from "@domain/enum/transactionType";
import { TransactionStatus } from "@domain/enum/transactionStatus";

export interface ITransactionModel extends Document {
  fromWalletId: string;
  toWalletId: string;
  relatedDealId?: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const transactionModel = model<ITransactionModel>("Transaction", transactionSchema);
