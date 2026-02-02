import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  updatePlanStatus,
} from "../../services/Admin/Plan/AdminPlanService";
import { QUERY_KEYS } from "../../constants/queryKey";
import type { PlanStatus } from "../../types/planStatus";
import type {
  CreatePlanPayload,
  UpdatePlanPayload,
  Plan,
  PaginatedPlansExplaination,
} from "../../types/planType";

/**
 * Get All Plans (Admin)
 */
export const useGetAllPlans = (params: {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}) => {
  return useQuery<PaginatedPlansExplaination>({
    queryKey: [QUERY_KEYS.ADMIN_PLANS, params],
    queryFn: () => getAllPlans(params),
  });
};

/**
 * Get Plan By ID
 */
export const useGetPlanById = (planId?: string) => {
  return useQuery<Plan>({
    queryKey: [QUERY_KEYS.ADMIN_PLAN_DETAIL, planId],
    queryFn: () => getPlanById(planId!),
    enabled: !!planId,
  });
};

/**
 * Create Plan
 */
export const useCreatePlan = () => {
  return useMutation<Plan, Error, CreatePlanPayload>({
    mutationFn: createPlan,
  });
};

/**
 * Update Plan
 */
export const useUpdatePlan = () => {
  return useMutation<
    Plan,
    Error,
    { planId: string; payload: UpdatePlanPayload }
  >({
    mutationFn: ({ planId, payload }) => updatePlan(planId, payload),
  });
};

export interface UpdateStatusContext {
  previousData?: PaginatedPlansExplaination;
}

/**
 * Update Plan Status
 */
export const useUpdatePlanStatus = () => {
  return useMutation<Plan, Error, { planId: string; status: PlanStatus }>({
    mutationFn: ({ planId, status }) => updatePlanStatus(planId, { status }),
  });
};
