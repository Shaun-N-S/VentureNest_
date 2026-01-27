import { PlanDTO } from "application/dto/plan/planDTO";

export interface IGetAllPlansUseCase {
  execute(
    page: number,
    limit: number,
    status?: string,
    search?: string
  ): Promise<{ plans: PlanDTO[]; total: number }>;
}
