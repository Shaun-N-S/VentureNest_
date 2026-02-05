import { ReceivedInvestmentOfferListItemDTO } from "application/dto/investor/investmentOfferDTO/receivedInvestmentOfferListItemDTO";

export interface IGetReceivedInvestmentOffersUseCase {
  execute(founderId: string): Promise<ReceivedInvestmentOfferListItemDTO[]>;
}
