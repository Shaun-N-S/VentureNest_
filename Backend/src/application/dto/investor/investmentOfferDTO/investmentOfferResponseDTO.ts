import { OfferStatus } from "@domain/enum/offerStatus";

export interface InvestmentOfferResponseDTO {
  offerId: string;

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

  createdAt: Date;
}
