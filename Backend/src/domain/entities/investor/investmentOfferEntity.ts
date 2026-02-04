import { OfferStatus } from "@domain/enum/offerStatus";

export interface InvestmentOfferEntity {
  _id?: string;

  pitchId: string;
  projectId: string;

  investorId: string;
  founderId: string;

  amount: number;
  equityPercentage: number;
  terms: string;

  status: OfferStatus;

  createdAt?: Date;
  updatedAt?: Date;
}
