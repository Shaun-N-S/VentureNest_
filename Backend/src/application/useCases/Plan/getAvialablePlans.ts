import { UserRole } from "@domain/enum/userRole";
import { PlanRole } from "@domain/enum/planRole";
import { IPlanRepository } from "@domain/interfaces/repositories/IPlanRepository";
import { IGetAvailablePlansUseCase } from "@domain/interfaces/useCases/plan/IGetAvailablePlans";
import { PlanDTO } from "application/dto/plan/planDTO";
import { PlanMapper } from "application/mappers/planMapper";

export class GetAvailablePlansUseCase implements IGetAvailablePlansUseCase {
  constructor(private _planRepository: IPlanRepository) {}

  async execute(userRole: UserRole): Promise<{ plans: PlanDTO[]; total: number }> {
    const planRole: PlanRole = userRole === UserRole.INVESTOR ? PlanRole.INVESTOR : PlanRole.USER;

    const plans = await this._planRepository.findByRole(planRole);

    return {
      plans: plans.map((plan) => PlanMapper.toDTO(plan)),
      total: plans.length,
    };
  }
}
