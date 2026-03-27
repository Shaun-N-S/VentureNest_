export type DealStatus = "PENDING" | "PARTIALLY_PAID" | "COMPLETED";

export interface DealSummary {
  dealId: string;
  projectId: string;
  investorId: string;
  totalAmount: number;
  amountPaid: number;
  remainingAmount: number;
  equityPercentage: number;
  status: DealStatus;
  createdAt: string;
}

export interface DealInstallment {
  installmentId: string;
  dealId: string;
  amount: number;
  platformFee: number;
  founderReceives: number;
  status: string;
  createdAt: string;
}
