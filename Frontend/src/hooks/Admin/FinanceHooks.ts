import { useQuery } from "@tanstack/react-query";
import { getAdminFinanceSummary } from "../../services/Admin/Finance/AdminFinanceService";

export const useAdminFinanceSummary = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["admin-finance-summary"],
    queryFn: getAdminFinanceSummary,
    staleTime: 1000 * 60 * 5,
    enabled,
  });
};
