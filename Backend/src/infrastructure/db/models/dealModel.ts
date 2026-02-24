import { Document, model } from "mongoose";
import { DealStatus } from "@domain/enum/dealStatus";
import { InvestmentType } from "@domain/enum/investmentType";
import { ConversionStatus } from "@domain/enum/conversionStatus";
import dealSchema from "../schema/dealSchema";

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
  equityAllocated: number;

  investmentType: InvestmentType;
  conversionStatus: ConversionStatus;

  status: DealStatus;

  createdAt: Date;
  updatedAt: Date;
}

export const dealModel = model<IDealModel>("Deal", dealSchema);
