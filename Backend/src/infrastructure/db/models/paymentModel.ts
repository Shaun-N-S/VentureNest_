import { model } from "mongoose";
import { Document } from "mongoose";
import PaymentSchema from "../schema/paymentSchema";
import { UserRole } from "@domain/enum/userRole";

export interface IPaymentModel extends Document {
  sessionId: string;
  ownerId: string;
  ownerRole: UserRole;
  planId: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export const PaymentModel = model<IPaymentModel>("Payment", PaymentSchema);
