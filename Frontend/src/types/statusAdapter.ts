import type { PlanStatus } from "../types/planStatus";

export const planStatusToModalStatus = (
  status: PlanStatus
): "ACTIVE" | "BLOCKED" => {
  return status === "Active" ? "ACTIVE" : "BLOCKED";
};

export const modalStatusToPlanStatus = (
  status: "ACTIVE" | "BLOCKED"
): PlanStatus => {
  return status === "ACTIVE" ? "Active" : "Inactive";
};
