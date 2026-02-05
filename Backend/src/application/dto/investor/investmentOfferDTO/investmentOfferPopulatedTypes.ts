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

export interface ReceivedInvestmentOfferPopulated {
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

  investorId: {
    _id: string;
    companyName: string;
    profileImg?: string;
  };
}

export interface InvestmentOfferDetailsPopulated {
  _id: string;
  pitchId: string;

  amount: number;
  equityPercentage: number;
  valuation?: number;
  terms: string;
  note?: string;

  status: OfferStatus;
  expiresAt?: Date;
  respondedAt?: Date;

  createdAt: Date;

  projectId: {
    _id: string;
    startupName: string;
    logoUrl?: string;
  };

  investorId: {
    _id: string;
    companyName: string;
    profileImg?: string;
  };

  founderId: {
    _id: string;
    userName: string;
    profileImg?: string;
  };
}
