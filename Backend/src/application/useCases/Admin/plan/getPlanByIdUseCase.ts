import { IGetPlanByIdUseCase } from "@domain/interfaces/useCases/admin/plan/IGetPlanByIdUseCase";
import { IPlanRepository } from "@domain/interfaces/repositories/IPlanRepository";
import { PlanDTO } from "application/dto/plan/planDTO";
import { PlanMapper } from "application/mappers/planMapper";
import { NotFoundExecption } from "application/constants/exceptions";
import { PLAN_ERRORS } from "@shared/constants/error";

export class GetPlanByIdUseCase implements IGetPlanByIdUseCase {
  constructor(private _planRepository: IPlanRepository) {}

  async execute(planId: string): Promise<PlanDTO> {
    const plan = await this._planRepository.findById(planId);

    if (!plan) {
      throw new NotFoundExecption(PLAN_ERRORS.PLAN_NOT_FOUND);
    }

    return PlanMapper.toDTO(plan);
  }
}
