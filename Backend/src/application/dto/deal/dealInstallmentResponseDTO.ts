import { DealInstallmentStatus } from "@domain/enum/dealInstallmentStatus";

export interface DealInstallmentResponseDTO {
  installmentId: string;
  dealId: string;

  amount: number;
  platformFee: number;
  founderReceives: number;

  status: DealInstallmentStatus;

  createdAt: Date;
}
