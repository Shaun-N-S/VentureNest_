import { DealStatus } from "@domain/enum/dealStatus";
import { InvestmentType } from "@domain/enum/investmentType";
import { ConversionStatus } from "@domain/enum/conversionStatus";

export interface DealEntity {
  _id?: string;

  projectId: string;
  offerId: string;

  founderId: string;
  investorId: string;

  totalAmount: number;
  amountPaid: number;
  remainingAmount: number;

  equityPercentage: number;
  equityAllocated: number;

  investmentType: InvestmentType;
  conversionStatus: ConversionStatus;

  status: DealStatus;

  createdAt?: Date;
  updatedAt?: Date;
}
