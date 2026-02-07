import { InvestmentOfferEntity } from "@domain/entities/investor/investmentOfferEntity";
import { IBaseRepository } from "./IBaseRepository";
import { OfferStatus } from "@domain/enum/offerStatus";
import {
  InvestmentOfferDetailsPopulated,
  ReceivedInvestmentOfferPopulated,
  SentInvestmentOfferPopulated,
} from "application/dto/investor/investmentOfferDTO/investmentOfferPopulatedTypes";

export interface IInvestmentOfferRepository extends IBaseRepository<InvestmentOfferEntity> {
  findSentByInvestor(
    investorId: string,
    skip: number,
    limit: number,
    status?: OfferStatus,
    search?: string
  ): Promise<{ items: SentInvestmentOfferPopulated[]; total: number }>;

  findReceivedByFounder(
    founderId: string,
    skip: number,
    limit: number,
    status?: OfferStatus,
    search?: string
  ): Promise<{ items: ReceivedInvestmentOfferPopulated[]; total: number }>;
  findDetailsById(offerId: string): Promise<InvestmentOfferDetailsPopulated | null>;
  updateStatus(offerId: string, status: OfferStatus): Promise<InvestmentOfferEntity | null>;
}
