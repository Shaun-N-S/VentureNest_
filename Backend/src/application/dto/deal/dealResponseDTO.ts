import { ConversionStatus } from "@domain/enum/conversionStatus";
import { DealStatus } from "@domain/enum/dealStatus";
import { InvestmentType } from "@domain/enum/investmentType";

export interface DealResponseDTO {
  dealId: string;
  projectId: string;
  investorId: string;

  totalAmount: number;
  amountPaid: number;
  remainingAmount: number;

  equityPercentage: number;
  equityAllocated: number;

  investmentType: InvestmentType;
  conversionStatus: ConversionStatus;

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
  equityAllocated: number;

  investmentType: InvestmentType;

  status: DealStatus;

  createdAt: Date;
}
