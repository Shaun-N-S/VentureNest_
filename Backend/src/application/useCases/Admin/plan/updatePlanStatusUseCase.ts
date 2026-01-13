import { IUpdatePlanStatusUseCase } from "@domain/interfaces/useCases/admin/plan/IUpdatePlanStatusUseCase";
import { IPlanRepository } from "@domain/interfaces/repositories/IPlanRepository";
import { PlanDTO } from "application/dto/plan/planDTO";
import { PlanMapper } from "application/mappers/planMapper";
import { PlanStatus } from "@domain/enum/planStatus";
import { NotFoundExecption } from "application/constants/exceptions";
import { PLAN_ERRORS } from "@shared/constants/error";

export class UpdatePlanStatusUseCase implements IUpdatePlanStatusUseCase {
  constructor(private _planRepository: IPlanRepository) {}

  async execute(planId: string, status: PlanStatus): Promise<PlanDTO> {
    const existingPlan = await this._planRepository.findById(planId);

    if (!existingPlan) {
      throw new NotFoundExecption(PLAN_ERRORS.PLAN_NOT_FOUND);
    }

    const updatedPlan = await this._planRepository.updateStatus(planId, status);

    if (!updatedPlan) {
      throw new NotFoundExecption(PLAN_ERRORS.PLAN_NOT_FOUND);
    }

    return PlanMapper.toDTO(updatedPlan);
  }
}
