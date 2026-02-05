import { OfferStatus } from "@domain/enum/offerStatus";

export interface InvestmentOfferDetailsResponseDTO {
  offerId: string;

  pitchId: string;

  project: {
    id: string;
    name: string;
    logoUrl?: string;
  };

  investor: {
    id: string;
    name: string;
    profileImg?: string;
  };

  founder: {
    id: string;
    name: string;
    profileImg?: string;
  };

  amount: number;
  equityPercentage: number;
  valuation?: number;

  terms: string;
  note?: string;

  status: OfferStatus;

  expiresAt?: Date;
  respondedAt?: Date;

  createdAt: string;
}
