import { useQuery } from "@tanstack/react-query";
import {
  getInvestorDashboardSummary,
  getInvestorPortfolio,
  getProjectAnalytics,
  getUserDashboard,
} from "../../services/Dashboard/dashboardService";
import type {
  InvestorDashboardSummary,
  InvestorPortfolio,
  ProjectAnalyticsFilters,
  UserDashboard,
} from "../../types/dashboard";

export const useUserDashboard = () => {
  return useQuery<UserDashboard>({
    queryKey: ["user-dashboard"],
    queryFn: getUserDashboard,
  });
};

export const useProjectAnalytics = (
  projectId?: string,
  filters?: ProjectAnalyticsFilters,
) => {
  return useQuery({
    queryKey: ["project-analytics", projectId, filters],
    queryFn: () => getProjectAnalytics(projectId!, filters),
    enabled: !!projectId,
  });
};

export const useInvestorDashboardSummary = () => {
  return useQuery<InvestorDashboardSummary>({
    queryKey: ["investor-dashboard-summary"],
    queryFn: getInvestorDashboardSummary,
  });
};

export const useInvestorPortfolio = () => {
  return useQuery<InvestorPortfolio>({
    queryKey: ["investor-portfolio"],
    queryFn: getInvestorPortfolio,
  });
};
