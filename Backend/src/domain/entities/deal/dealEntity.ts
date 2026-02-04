import { DealStatus } from "@domain/enum/dealStatus";

export interface DealEntity {
  _id?: string;

  projectId: string;
  offerId: string;

  founderId: string;
  investorId: string;

  amount: number;
  equityPercentage: number;

  platformFee: number;
  founderReceives: number;

  status: DealStatus;

  createdAt?: Date;
  updatedAt?: Date;
}
