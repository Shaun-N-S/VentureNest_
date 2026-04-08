import AxiosInstance from "../../../axios/axios";
import { API_ROUTES } from "../../../constants/apiRoutes";
import type { AdminDashboardSummary, AdminDashboardTop, MonthlyRevenue } from "../../../types/adminDashboardTypes";

export const getAdminDashboardSummary =
  async (): Promise<AdminDashboardSummary> => {
    const response = await AxiosInstance.get(
      API_ROUTES.ADMIN.DASHBOARD_SUMMARY,
    );

    return response.data.data;
  };

export interface GraphParams {
  type: "subscription" | "commission";
  year?: number;
  month?: number;
  fromDate?: string;
  toDate?: string;
}

export const getAdminDashboardGraph = async (
  params: GraphParams,
): Promise<MonthlyRevenue[]> => {
  const response = await AxiosInstance.get(API_ROUTES.ADMIN.DASHBOARD_GRAPH, {
    params,
  });

  return response.data.data;
};

export const getAdminDashboardTop = async (): Promise<AdminDashboardTop> => {
  const response = await AxiosInstance.get(API_ROUTES.ADMIN.DASHBOARD_TOP);

  return response.data.data;
};
