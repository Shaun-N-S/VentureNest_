import { Document, model } from "mongoose";
import transactionSchema from "../schema/transactionSchema";
import { TransactionStatus } from "@domain/enum/transactionStatus";
import { TransactionAction, TransactionReason } from "@domain/enum/transactionType";

export interface ITransactionModel extends Document {
  _id: string;
  fromWalletId?: string;
  toWalletId?: string;

  relatedDealId?: string;
  relatedPaymentId?: string;

  amount: number;

  action: TransactionAction;
  reason: TransactionReason;

  status: TransactionStatus;

  createdAt: Date;
  updatedAt: Date;
}

export const transactionModel = model<ITransactionModel>("Transaction", transactionSchema);
