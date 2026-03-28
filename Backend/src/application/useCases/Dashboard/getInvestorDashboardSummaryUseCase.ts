import { IGetInvestorDashboardSummaryUseCase } from "@domain/interfaces/useCases/dashboard/IGetInvestorDashboardSummaryUseCase";
import { IDealRepository } from "@domain/interfaces/repositories/IDealRepository";
import { IWalletRepository } from "@domain/interfaces/repositories/IWalletRepository";
import { InvestorDashboardSummaryDTO } from "application/dto/dashboard/investorDashboardSummaryDTO";
import { InvestorDashboardMapper } from "application/mappers/investorDashboardMapper";
import { WalletOwnerType } from "@domain/enum/walletOwnerType";

export class GetInvestorDashboardSummaryUseCase implements IGetInvestorDashboardSummaryUseCase {
  constructor(
    private _dealRepo: IDealRepository,
    private _walletRepo: IWalletRepository
  ) {}

  async execute(investorId: string): Promise<InvestorDashboardSummaryDTO> {
    const deals = await this._dealRepo.findByInvestorId(investorId);

    const wallet = await this._walletRepo.findByOwner(WalletOwnerType.INVESTOR, investorId);

    return InvestorDashboardMapper.toDTO(deals, wallet);
  }
}
