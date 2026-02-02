import { PlanStatus } from "@domain/enum/planStatus";

export interface UpdatePlanStatusDTO {
  status: PlanStatus | undefined;
}
