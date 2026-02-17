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
