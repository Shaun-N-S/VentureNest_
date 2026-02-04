import { Document, model } from "mongoose";
import dealSchema from "../schema/dealSchema";
import { DealStatus } from "@domain/enum/dealStatus";

export interface IDealModel extends Document {
  projectId: string;
  offerId: string;
  founderId: string;
  investorId: string;
  amount: number;
  equityPercentage: number;
  platformFee: number;
  founderReceives: number;
  status: DealStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const dealModel = model<IDealModel>("Deal", dealSchema);
