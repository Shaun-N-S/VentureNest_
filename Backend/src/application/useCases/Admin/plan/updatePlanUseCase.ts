import { IUpdatePlanUseCase } from "@domain/interfaces/useCases/admin/plan/IUpdatePlanUseCase";
import { IPlanRepository } from "@domain/interfaces/repositories/IPlanRepository";
import { UpdatePlanDTO } from "application/dto/plan/updatePlanDTO";
import { PlanDTO } from "application/dto/plan/planDTO";
import { PlanMapper } from "application/mappers/planMapper";
import { NotFoundExecption } from "application/constants/exceptions";
import { PLAN_ERRORS } from "@shared/constants/error";

export class UpdatePlanUseCase implements IUpdatePlanUseCase {
  constructor(private _planRepository: IPlanRepository) {}

  async execute(planId: string, data: UpdatePlanDTO): Promise<PlanDTO> {
    const existingPlan = await this._planRepository.findById(planId);

    if (!existingPlan) {
      throw new NotFoundExecption(PLAN_ERRORS.PLAN_NOT_FOUND);
    }

    const mergedEntity = PlanMapper.mergeForUpdate(existingPlan, data);

    const updatedPlan = await this._planRepository.update(planId, mergedEntity);

    if (!updatedPlan) {
      throw new NotFoundExecption(PLAN_ERRORS.PLAN_NOT_FOUND);
    }

    return PlanMapper.toDTO(updatedPlan);
  }
}
