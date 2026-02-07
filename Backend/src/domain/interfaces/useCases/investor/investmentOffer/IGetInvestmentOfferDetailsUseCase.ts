import { InvestmentOfferDetailsResponseDTO } from "application/dto/investor/investmentOfferDTO/investmentOfferDetailsResponseDTO";

export interface IGetInvestmentOfferDetailsUseCase {
  execute(offerId: string, viewerId: string): Promise<InvestmentOfferDetailsResponseDTO>;
}
