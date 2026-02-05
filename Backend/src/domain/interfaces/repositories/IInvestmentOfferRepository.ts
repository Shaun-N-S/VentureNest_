import { InvestmentOfferEntity } from "@domain/entities/investor/investmentOfferEntity";
import { IBaseRepository } from "./IBaseRepository";
import { OfferStatus } from "@domain/enum/offerStatus";
import {
  ReceivedInvestmentOfferPopulated,
  SentInvestmentOfferPopulated,
} from "application/dto/investor/investmentOfferDTO/investmentOfferPopulatedTypes";

export interface IInvestmentOfferRepository extends IBaseRepository<InvestmentOfferEntity> {
  findSentByInvestor(investorId: string): Promise<SentInvestmentOfferPopulated[]>;
  findReceivedByFounder(founderId: string): Promise<ReceivedInvestmentOfferPopulated[]>;
  updateStatus(offerId: string, status: OfferStatus): Promise<InvestmentOfferEntity | null>;
}
