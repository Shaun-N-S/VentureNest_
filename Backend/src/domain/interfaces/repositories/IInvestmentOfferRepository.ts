import { InvestmentOfferEntity } from "@domain/entities/investor/investmentOfferEntity";
import { IBaseRepository } from "./IBaseRepository";
import { OfferStatus } from "@domain/enum/offerStatus";
import {
  InvestmentOfferDetailsPopulated,
  ReceivedInvestmentOfferPopulated,
  SentInvestmentOfferPopulated,
} from "application/dto/investor/investmentOfferDTO/investmentOfferPopulatedTypes";

export interface IInvestmentOfferRepository extends IBaseRepository<InvestmentOfferEntity> {
  findSentByInvestor(investorId: string): Promise<SentInvestmentOfferPopulated[]>;
  findReceivedByFounder(founderId: string): Promise<ReceivedInvestmentOfferPopulated[]>;
  findDetailsById(offerId: string): Promise<InvestmentOfferDetailsPopulated | null>;
  updateStatus(offerId: string, status: OfferStatus): Promise<InvestmentOfferEntity | null>;
}
