import { model } from "mongoose";
import { Document } from "mongoose";
import PaymentSchema from "../schema/paymentSchema";
import { UserRole } from "@domain/enum/userRole";
import { PaymentPurpose } from "@domain/enum/paymentPurpose";

export interface IPaymentModel extends Document {
  id: string;
  sessionId: string;
  ownerId: string;
  ownerRole: UserRole;
  planId?: string;
  purpose: PaymentPurpose;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export const PaymentModel = model<IPaymentModel>("Payment", PaymentSchema);
