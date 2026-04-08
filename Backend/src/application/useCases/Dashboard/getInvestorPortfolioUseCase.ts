import { IGetInvestorPortfolioUseCase } from "@domain/interfaces/useCases/dashboard/IGetInvestorPortfolioUseCase";
import { IDealRepository } from "@domain/interfaces/repositories/IDealRepository";
import { InvestorPortfolioData } from "application/dto/dashboard/investorPortfolioDTO";
import { InvestorDashboardMapper } from "application/mappers/investorDashboardMapper";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { CONFIG } from "@config/config";

export class GetInvestorPortfolioUseCase implements IGetInvestorPortfolioUseCase {
  constructor(
    private _dealRepo: IDealRepository,
    private _storageService: IStorageService
  ) {}

  async execute(investorId: string): Promise<InvestorPortfolioData> {
    const data = await this._dealRepo.findInvestorPortfolio(investorId);

    const result = await Promise.all(
      data.map(async (item) => {
        let logoUrl = item.logo;

        if (logoUrl) {
          logoUrl = await this._storageService.createSignedUrl(logoUrl, CONFIG.SIGNED_URL_EXPIRY);
        }

        return {
          ...item,
          ...(logoUrl && { logo: logoUrl }),
        };
      })
    );

    return InvestorDashboardMapper.toPortfolioDTO(result);
  }
}
