import { SentInvestmentOfferListItemDTO } from "application/dto/investor/investmentOfferDTO/sentInvestmentOfferListItemDTO";

export interface IGetSentInvestmentOffersUseCase {
  execute(investorId: string): Promise<SentInvestmentOfferListItemDTO[]>;
}
