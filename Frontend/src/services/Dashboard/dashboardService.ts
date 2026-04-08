import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type {
  InvestorDashboardSummary,
  InvestorPortfolio,
  ProjectAnalyticsFilters,
  ProjectReportAnalyticsResponse,
  UserDashboard,
} from "../../types/dashboard";

export const getUserDashboard = async (): Promise<UserDashboard> => {
  const response = await AxiosInstance.get(API_ROUTES.DASHBOARD.USER);

  return response.data.data;
};

export const getProjectAnalytics = async (
  projectId: string,
  filters?: ProjectAnalyticsFilters,
): Promise<ProjectReportAnalyticsResponse> => {
  const response = await AxiosInstance.get(
    API_ROUTES.DASHBOARD.PROJECT_ANALYTICS,
    {
      params: {
        projectId,
        ...(filters?.fromDate && { fromDate: filters.fromDate }),
        ...(filters?.toDate && { toDate: filters.toDate }),
        ...(filters?.month && { month: filters.month }),
        ...(filters?.year !== undefined && { year: filters.year }),
      },
    },
  );

  return response.data.data;
};

export const getInvestorDashboardSummary =
  async (): Promise<InvestorDashboardSummary> => {
    const response = await AxiosInstance.get(
      API_ROUTES.DASHBOARD.INVESTOR_SUMMARY,
    );

    return response.data.data;
  };

export const getInvestorPortfolio = async (): Promise<InvestorPortfolio> => {
  const response = await AxiosInstance.get(
    API_ROUTES.DASHBOARD.INVESTOR_PORTFOLIO,
  );

  return response.data.data;
};
