import type { DealStatus } from "./dealTypes";

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
  expiresAt?: string;
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
  pitchId: string;

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
    name: string;
    profileImg?: string;
  };

  amount: number;
  equityPercentage: number;
  valuation?: number;
  terms: string;
  note?: string;

  status: OfferStatus;
  rejectionReason?: string;

  expiresAt?: string;
  respondedAt?: string;
  createdAt: string;

  deal?: {
    dealId: string;
    projectId: string;
    founderId: string;
    investorId: string;

    totalAmount: number;
    amountPaid: number;
    remainingAmount: number;
    equityPercentage: number;
    status: DealStatus;
    createdAt: string;

    installments: {
      installmentId: string;
      amount: number;
      platformFee: number;
      founderReceives: number;
      status: string;
      createdAt: string;
    }[];

    totalPlatformEarned: number;
    totalFounderReceived: number;
  };
}


export interface AcceptInvestmentOfferResponse {
  offerId: string;
  status: OfferStatus;
  respondedAt: string;
}

export interface RejectInvestmentOfferPayload {
  offerId: string;
  reason: string;
}

export interface RejectInvestmentOfferResponse {
  offerId: string;
  status: OfferStatus;
  respondedAt: string;
  rejectionReason: string;
}
