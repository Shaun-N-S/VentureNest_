import { IGetInvestorPortfolioUseCase } from "@domain/interfaces/useCases/dashboard/IGetInvestorPortfolioUseCase";
import { IDealRepository } from "@domain/interfaces/repositories/IDealRepository";
import { InvestorPortfolioDTO } from "application/dto/dashboard/investorPortfolioDTO";

export class GetInvestorPortfolioUseCase implements IGetInvestorPortfolioUseCase {
  constructor(private _dealRepo: IDealRepository) {}

  async execute(investorId: string): Promise<InvestorPortfolioDTO> {
    return await this._dealRepo.findInvestorPortfolio(investorId);
  }
}
