import { IDealRepository } from "@domain/interfaces/repositories/IDealRepository";
import { IGetAdminDashboardInsightsUseCase } from "@domain/interfaces/useCases/admin/dashboard/IGetAdminDashboardInsightsUseCase";
import { AdminDashboardInsightsDTO } from "application/dto/admin/adminDashboardInsightsDTO";
import { AdminDashboardInsightsMapper } from "application/mappers/adminDashboardInsightsMapper";

export class GetAdminDashboardInsightsUseCase implements IGetAdminDashboardInsightsUseCase {
  constructor(private _dealRepo: IDealRepository) {}

  async execute(): Promise<AdminDashboardInsightsDTO> {
    const LIMIT = 5;
    const [categories, stages] = await Promise.all([
      this._dealRepo.getTopFundedCategories(LIMIT),
      this._dealRepo.getTopFundedStages(LIMIT),
    ]);

    return AdminDashboardInsightsMapper.toDTO(categories, stages);
  }
}
