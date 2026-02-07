import { CreateInvestmentOfferDTO } from "application/dto/investor/investmentOfferDTO/createInvestmentOfferDTO";
import { InvestmentOfferResponseDTO } from "application/dto/investor/investmentOfferDTO/investmentOfferResponseDTO";

export interface ICreateInvestmentOfferUseCase {
  execute(data: CreateInvestmentOfferDTO, investorId: string): Promise<InvestmentOfferResponseDTO>;
}
