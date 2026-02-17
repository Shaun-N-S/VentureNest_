import { DealStatus } from "@domain/enum/dealStatus";

export interface DealResponseDTO {
  dealId: string;
  projectId: string;
  investorId: string;

  totalAmount: number;
  amountPaid: number;
  remainingAmount: number;

  equityPercentage: number;
  status: DealStatus;

  createdAt: Date;
}

export interface DealSummaryDTO {
  dealId: string;

  projectId: string;

  totalAmount: number;
  amountPaid: number;
  remainingAmount: number;

  equityPercentage: number;

  status: DealStatus;

  createdAt: Date;
}
