import { PlanDTO } from "application/dto/plan/planDTO";

export interface IGetPlanByIdUseCase {
  execute(planId: string): Promise<PlanDTO>;
}
