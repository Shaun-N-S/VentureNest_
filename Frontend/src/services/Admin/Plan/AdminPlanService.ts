import AxiosInstance from "../../../axios/axios";
import { API_ROUTES } from "../../../constants/apiRoutes";
import type { PlanStatus } from "../../../types/planStatus";
import type { CreatePlanPayload, UpdatePlanPayload } from "../../../types/planType";

export const createPlan = async (payload: CreatePlanPayload) => {
  const response = await AxiosInstance.post(API_ROUTES.ADMIN.PLANS, payload);
  return response.data.data;
};

export const getAllPlans = async (params: {
  page: number;
  limit: number;
  status?: string;
}) => {
  const response = await AxiosInstance.get(API_ROUTES.ADMIN.PLANS, {
    params,
  });
  return response.data.data;
};

export const getPlanById = async (planId: string) => {
  const response = await AxiosInstance.get(
    API_ROUTES.ADMIN.PLAN_BY_ID.replace(":planId", planId)
  );
  return response.data.data;
};

export const updatePlan = async (
  planId: string,
  payload: UpdatePlanPayload
) => {
  const response = await AxiosInstance.put(
    API_ROUTES.ADMIN.PLAN_BY_ID.replace(":planId", planId),
    payload
  );
  return response.data.data;
};

export const updatePlanStatus = async (
  planId: string,
  payload: { status: PlanStatus }
) => {
  const response = await AxiosInstance.patch(
    API_ROUTES.ADMIN.PLAN_STATUS.replace(":planId", planId),
    payload
  );
  return response.data.data;
};
