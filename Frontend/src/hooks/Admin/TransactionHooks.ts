import { useQuery } from "@tanstack/react-query";
import { getAdminTransactions } from "../../services/Admin/Transaction/AdminFinanceService";

export const useAdminTransactions = (
  page: number,
  limit: number,
  filters?: {
    reason?: string;
    action?: string;
    status?: string;
    dealId?: string;
  },
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: [
      "admin-transactions",
      page,
      limit,
      filters?.reason,
      filters?.action,
      filters?.status,
      filters?.dealId,
    ],
    queryFn: () =>
      getAdminTransactions(
        page,
        limit,
        filters?.reason,
        filters?.action,
        filters?.status,
        filters?.dealId,
      ),
    enabled,
  });
};
