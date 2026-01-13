import { UpdatePlanDTO } from "application/dto/plan/updatePlanDTO";
import { PlanDTO } from "application/dto/plan/planDTO";

export interface IUpdatePlanUseCase {
  execute(planId: string, data: UpdatePlanDTO): Promise<PlanDTO>;
}
