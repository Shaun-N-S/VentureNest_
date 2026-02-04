import { Document, model } from "mongoose";
import investmentOfferSchema from "../schema/investmentOfferSchema";
import { OfferStatus } from "@domain/enum/offerStatus";

export interface IInvestmentOfferModel extends Document {
  _id: string;
  pitchId: string;
  projectId: string;
  investorId: string;
  founderId: string;
  amount: number;
  equityPercentage: number;
  terms: string;
  status: OfferStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const investmentOfferModel = model<IInvestmentOfferModel>(
  "InvestmentOffer",
  investmentOfferSchema
);
