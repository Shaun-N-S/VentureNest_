import { AcceptInvestmentOfferResponseDTO } from "application/dto/investor/investmentOfferDTO/acceptInvestmentOfferResponseDTO";

export interface IAcceptInvestmentOfferUseCase {
  execute(offerId: string, founderId: string): Promise<AcceptInvestmentOfferResponseDTO>;
}
