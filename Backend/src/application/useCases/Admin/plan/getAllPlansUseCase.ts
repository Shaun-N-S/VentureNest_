import { IGetAllPlansUseCase } from "@domain/interfaces/useCases/admin/plan/IGetAllPlansUseCase";
import { IPlanRepository } from "@domain/interfaces/repositories/IPlanRepository";
import { PlanDTO } from "application/dto/plan/planDTO";
import { PlanMapper } from "application/mappers/planMapper";

export class GetAllPlansUseCase implements IGetAllPlansUseCase {
  constructor(private _planRepository: IPlanRepository) {}

  async execute(
    page: number,
    limit: number,
    status?: string
  ): Promise<{ plans: PlanDTO[]; total: number }> {
    const skip = (page - 1) * limit;

    const plans = await this._planRepository.findAll(skip, limit, status);
    const total = await this._planRepository.count(status);

    return {
      plans: plans.map((plan) => PlanMapper.toDTO(plan)),
      total,
    };
  }
}
