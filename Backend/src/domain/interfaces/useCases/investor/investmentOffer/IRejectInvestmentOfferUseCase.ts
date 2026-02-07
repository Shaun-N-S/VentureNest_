import { AcceptInvestmentOfferResponseDTO } from "application/dto/investor/investmentOfferDTO/acceptInvestmentOfferResponseDTO";

export interface IRejectInvestmentOfferUseCase {
  execute(
    offerId: string,
    founderId: string,
    reason: string
  ): Promise<AcceptInvestmentOfferResponseDTO>;
}
