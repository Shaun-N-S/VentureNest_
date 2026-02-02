import { UserRole } from "@domain/enum/userRole";
import { PlanDTO } from "application/dto/plan/planDTO";

export interface IGetAvailablePlansUseCase {
  execute(userRole: UserRole): Promise<{ plans: PlanDTO[]; total: number }>;
}
