export const OfferStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  EXPIRED: "EXPIRED",
} as const;

export type OfferStatus = (typeof OfferStatus)[keyof typeof OfferStatus];

export interface CreateInvestmentOfferPayload {
  pitchId: string;
  projectId: string;

  amount: number;
  equityPercentage: number;
  terms: string;

  valuation?: number;
  note?: string;
  expiresAt?: string; // ISO string from frontend
}

export interface InvestmentOfferResponse {
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
  expiresAt?: string;
  createdAt: string;
}

export interface SentInvestmentOfferListItem {
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

export interface ReceivedInvestmentOfferListItem {
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

export interface InvestmentOfferDetails {
  offerId: string;

  project: {
    id: string;
    name: string;
    logoUrl?: string;
  };

  founder: {
    id: string;
    name: string;
    profileImg?: string;
  };

  investor: {
    id: string;
    companyName: string;
    profileImg?: string;
  };

  amount: number;
  equityPercentage: number;
  valuation?: number;
  terms: string;
  note?: string;

  status: OfferStatus;
  expiresAt?: string;
  createdAt: string;
}

export interface AcceptInvestmentOfferResponse {
  offerId: string;
  status: OfferStatus;
  respondedAt: string;
}
