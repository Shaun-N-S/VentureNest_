import type { PlanStatus } from "./planStatus";

export const planStatusToModalStatus = (
  status: PlanStatus,
): "ACTIVE" | "BLOCKED" => {
  return status === "ACTIVE" ? "ACTIVE" : "BLOCKED";
};