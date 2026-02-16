import { DealInstallmentStatus } from "@domain/enum/dealInstallmentStatus";

export interface DealInstallmentEntity {
  _id?: string;

  dealId: string;

  amount: number;
  platformFee: number;
  founderReceives: number;

  status: DealInstallmentStatus;

  createdAt?: Date;
  updatedAt?: Date;
}
