import { CreatePlanDTO } from "application/dto/plan/createPlanDTO";
import { PlanDTO } from "application/dto/plan/planDTO";

export interface ICreatePlanUseCase {
  execute(data: CreatePlanDTO): Promise<PlanDTO>;
}
