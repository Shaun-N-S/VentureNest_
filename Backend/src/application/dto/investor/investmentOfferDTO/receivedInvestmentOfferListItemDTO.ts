import { OfferStatus } from "@domain/enum/offerStatus";

export interface ReceivedInvestmentOfferListItemDTO {
  offerId: string;

  projectId: string;
  projectName: string;
  projectLogoUrl?: string;

  investorId: string;
  investorName: string;
  investorProfileImg?: string;

  amount: number;
  equityPercentage: number;
  valuation?: number;

  status: OfferStatus;
  createdAt: string;
}
