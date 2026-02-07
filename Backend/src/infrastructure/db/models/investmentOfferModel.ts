import { Document, model } from "mongoose";
import investmentOfferSchema from "../schema/investmentOfferSchema";
import { OfferStatus } from "@domain/enum/offerStatus";
import { UserRole } from "@domain/enum/userRole";

export interface IInvestmentOfferModel extends Document {
  _id: string;
  pitchId: string;
  projectId: string;
  investorId: string;
  founderId: string;

  amount: number;
  equityPercentage: number;
  valuation?: number;
  terms: string;
  note?: string;

  status: OfferStatus;
  expiresAt?: Date;
  respondedAt?: Date;
  respondedBy?: UserRole;

  rejectionReason?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const investmentOfferModel = model<IInvestmentOfferModel>(
  "InvestmentOffer",
  investmentOfferSchema
);
