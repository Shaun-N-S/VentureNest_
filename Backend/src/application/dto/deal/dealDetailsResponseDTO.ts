import { DealStatus } from "@domain/enum/dealStatus";
import { DealInstallmentStatus } from "@domain/enum/dealInstallmentStatus";
import { ConversionStatus } from "@domain/enum/conversionStatus";
import { InvestmentType } from "@domain/enum/investmentType";

export interface InstallmentDTO {
  installmentId: string;
  amount: number;
  platformFee: number;
  founderReceives: number;
  status: DealInstallmentStatus;
  createdAt: Date;
}

export interface DealDetailsResponseDTO {
  dealId: string;
  projectId: string;
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

  installments: InstallmentDTO[];

  totalPlatformEarned: number;
  totalFounderReceived: number;

  createdAt: Date;
}

export interface DealInstallmentDTO {
  installmentId: string;
  dealId: string;
  amount: number;
  platformFee: number;
  founderReceives: number;
  status: DealInstallmentStatus;
  createdAt: Date;
}
