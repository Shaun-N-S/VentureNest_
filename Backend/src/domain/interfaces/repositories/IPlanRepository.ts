import { PlanEntity } from "@domain/entities/plan/planEntity";
import { IBaseRepository } from "./IBaseRepository";
import { PlanRole } from "@domain/enum/planRole";
import { PlanStatus } from "@domain/enum/planStatus";

export interface IPlanRepository extends IBaseRepository<PlanEntity> {
  findByRole(role: PlanRole): Promise<PlanEntity[]>;
  updateStatus(planId: string, status: PlanStatus): Promise<PlanEntity | null>;
  findAllPlans(
    skip: number,
    limit: number,
    status?: string,
    search?: string
  ): Promise<PlanEntity[]>;

  countPlans(status?: string, search?: string): Promise<number>;
}
