import { Document, model } from "mongoose";
import dealSchema from "../schema/dealSchema";
import { DealStatus } from "@domain/enum/dealStatus";

export interface IDealModel extends Document {
  _id: string;
  projectId: string;
  offerId: string;
  founderId: string;
  investorId: string;

  totalAmount: number;
  amountPaid: number;
  remainingAmount: number;

  equityPercentage: number;

  status: DealStatus;

  createdAt: Date;
  updatedAt: Date;
}

export const dealModel = model<IDealModel>("Deal", dealSchema);
