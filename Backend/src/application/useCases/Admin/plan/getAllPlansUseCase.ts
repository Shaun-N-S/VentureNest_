import { IGetAllPlansUseCase } from "@domain/interfaces/useCases/admin/plan/IGetAllPlansUseCase";
import { IPlanRepository } from "@domain/interfaces/repositories/IPlanRepository";
import { PlanDTO } from "application/dto/plan/planDTO";
import { PlanMapper } from "application/mappers/planMapper";

export class GetAllPlansUseCase implements IGetAllPlansUseCase {
  constructor(private _planRepository: IPlanRepository) {}

  async execute(
    page: number,
    limit: number,
    status?: string,
    search?: string
  ): Promise<{ plans: PlanDTO[]; total: number }> {
    const skip = (page - 1) * limit;

    const plans = await this._planRepository.findAllPlans(skip, limit, status, search);

    const total = await this._planRepository.countPlans(status, search);

    return {
      plans: plans.map((plan) => PlanMapper.toDTO(plan)),
      total,
    };
  }
}
