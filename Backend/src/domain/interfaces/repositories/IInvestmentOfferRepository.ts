import { InvestmentOfferEntity } from "@domain/entities/investor/investmentOfferEntity";
import { IBaseRepository } from "./IBaseRepository";
import { OfferStatus } from "@domain/enum/offerStatus";

export interface IInvestmentOfferRepository extends IBaseRepository<InvestmentOfferEntity> {
  findSentByInvestor(investorId: string): Promise<InvestmentOfferEntity[]>;
  findReceivedByFounder(founderId: string): Promise<InvestmentOfferEntity[]>;
  updateStatus(offerId: string, status: OfferStatus): Promise<InvestmentOfferEntity | null>;
}
