import { DealStatus } from "@domain/enum/dealStatus";

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

  status: DealStatus;

  createdAt?: Date;
  updatedAt?: Date;
}
