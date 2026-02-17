import { DealInstallmentStatus } from "@domain/enum/dealInstallmentStatus";
import { UserRole } from "@domain/enum/userRole";

export interface DealInstallmentResponseDTO {
  installmentId: string;
  dealId: string;

  amount: number;
  platformFee: number;
  founderReceives: number;

  status: DealInstallmentStatus;

  createdAt: Date;
}

export interface HandleDealInstallmentStripeCompletedDTO {
  sessionId: string;
  ownerId: string;
  ownerRole: UserRole;
  dealId: string;
  amount: number;
}
