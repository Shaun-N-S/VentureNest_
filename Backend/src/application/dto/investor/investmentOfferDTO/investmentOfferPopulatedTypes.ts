import { OfferStatus } from "@domain/enum/offerStatus";

export interface SentInvestmentOfferPopulated {
  _id: string;
  amount: number;
  equityPercentage: number;
  valuation?: number;
  status: OfferStatus;
  createdAt: Date;

  projectId: {
    _id: string;
    startupName: string;
    logoUrl?: string;
  };

  founderId: {
    _id: string;
    userName: string;
    profileImg?: string;
  };
}
