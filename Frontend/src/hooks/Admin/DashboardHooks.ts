import { useQuery } from "@tanstack/react-query";
import {
  getAdminDashboardGraph,
  getAdminDashboardSummary,
  getAdminDashboardTop,
  type GraphParams,
} from "../../services/Admin/Dashboard/AdminDashboardService";

export const useAdminDashboardSummary = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["admin-dashboard-summary"],
    queryFn: getAdminDashboardSummary,
    staleTime: 1000 * 60 * 5,
    enabled,
  });
};

export const useAdminDashboardGraph = (
  params: GraphParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["admin-dashboard-graph", params],
    queryFn: () => getAdminDashboardGraph(params),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
};

export const useAdminDashboardTop = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["admin-dashboard-top"],
    queryFn: getAdminDashboardTop,
    staleTime: 1000 * 60 * 5,
    enabled,
  });
};
