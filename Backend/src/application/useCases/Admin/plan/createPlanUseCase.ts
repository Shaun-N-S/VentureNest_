import { ICreatePlanUseCase } from "@domain/interfaces/useCases/admin/plan/ICreatePlanUseCase";
import { IPlanRepository } from "@domain/interfaces/repositories/IPlanRepository";
import { CreatePlanDTO } from "application/dto/plan/createPlanDTO";
import { PlanDTO } from "application/dto/plan/planDTO";
import { PlanMapper } from "application/mappers/planMapper";

export class CreatePlanUseCase implements ICreatePlanUseCase {
  constructor(private _planRepository: IPlanRepository) {}

  async execute(data: CreatePlanDTO): Promise<PlanDTO> {
    const planEntity = PlanMapper.toEntity(data);

    const savedPlan = await this._planRepository.save(planEntity);

    return PlanMapper.toDTO(savedPlan);
  }
}
