import { Document, model } from "mongoose";
import dealInstallmentSchema from "../schema/dealInstallmentSchema";
import { DealInstallmentStatus } from "@domain/enum/dealInstallmentStatus";

export interface IDealInstallmentModel extends Document {
  _id: string;
  dealId: string;

  amount: number;
  platformFee: number;
  founderReceives: number;

  status: DealInstallmentStatus;

  createdAt: Date;
  updatedAt: Date;
}

export const dealInstallmentModel = model<IDealInstallmentModel>(
  "DealInstallment",
  dealInstallmentSchema
);
