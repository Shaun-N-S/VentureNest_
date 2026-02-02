import { PlanDTO } from "application/dto/plan/planDTO";
import { PlanStatus } from "@domain/enum/planStatus";

export interface IUpdatePlanStatusUseCase {
  execute(planId: string, status: PlanStatus): Promise<PlanDTO>;
}
