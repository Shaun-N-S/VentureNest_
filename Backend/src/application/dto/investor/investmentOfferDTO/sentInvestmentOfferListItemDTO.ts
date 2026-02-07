import { OfferStatus } from "@domain/enum/offerStatus";

export interface SentInvestmentOfferListItemDTO {
  offerId: string;

  projectId: string;
  projectName: string;
  projectLogoUrl?: string;

  founderId: string;
  founderName: string;
  founderProfileImg?: string;

  amount: number;
  equityPercentage: number;
  valuation?: number;

  status: OfferStatus;
  createdAt: string;
}
