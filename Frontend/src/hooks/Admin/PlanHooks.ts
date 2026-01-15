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
} from "../../types/planType";

interface PaginatedResponse<T> {
  plans: T[];
  total: number;
}

/**
 * Get All Plans (Admin)
 */
export const useGetAllPlans = (params: {
  page: number;
  limit: number;
  status?: string;
}) => {
  return useQuery<PaginatedResponse<Plan>>({
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
  return useMutation({
    mutationFn: (payload: CreatePlanPayload) => createPlan(payload),
  });
};

/**
 * Update Plan
 */
export const useUpdatePlan = () => {
  return useMutation({
    mutationFn: ({
      planId,
      payload,
    }: {
      planId: string;
      payload: UpdatePlanPayload;
    }) => updatePlan(planId, payload),
  });
};

/**
 * Update Plan Status
 */
export const useUpdatePlanStatus = () => {
  return useMutation({
    mutationFn: ({ planId, status }: { planId: string; status: PlanStatus }) =>
      updatePlanStatus(planId, { status }),
  });
};
